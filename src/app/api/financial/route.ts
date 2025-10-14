import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { FinancialData, APIResponse } from '@/types/financial'
import { verifyToken, getUserById } from '@/lib/auth'
import { parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Função auxiliar para extrair token do header Authorization
function getTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7) // Remove "Bearer " prefix
}

// Middleware de autenticação
async function authenticateUser(request: NextRequest) {
  try {
    // Extrair token do header Authorization
    const token = getTokenFromHeader(request)

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Token não fornecido',
            message: 'Token de autenticação é obrigatório'
          }
        },
        { status: 401 }
      )
    }

    // Verificar token
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Token inválido',
            message: 'Token de autenticação inválido ou expirado'
          }
        },
        { status: 401 }
      )
    }

    // Buscar usuário pelo ID do token
    const user = await getUserById(decoded.userId)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Usuário não encontrado',
            message: 'Usuário não encontrado no sistema'
          }
        },
        { status: 404 }
      )
    }

    // Verificar se usuário está ativo
    if (!user.ativo) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Conta desativada',
            message: 'Sua conta está desativada'
          }
        },
        { status: 401 }
      )
    }

    return user
  } catch (error) {
    console.error('Erro na autenticação:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Erro durante a autenticação'
        }
      },
      { status: 500 }
    )
  }
}

// GET /api/financial - Buscar dados financeiros
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await authenticateUser(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const authenticatedUser = authResult

    // Extrair parâmetros de data da query string
    const { searchParams } = new URL(request.url)
    const startDateParam = searchParams.get('start_date')
    const endDateParam = searchParams.get('end_date')

    // Configurar período de busca
    let startDate: Date
    let endDate: Date

    if (startDateParam && endDateParam) {
      // Se as datas foram fornecidas, usar elas
      startDate = parse(startDateParam, 'yyyy-MM-dd', new Date(), {
        locale: ptBR
        })
      startDate.setHours(0, 0, 0, 0)
      endDate = parse(endDateParam, 'yyyy-MM-dd', new Date(), {
        locale: ptBR
      })
      // Ajustar o final do dia para incluir todas as transações do dia
      endDate.setHours(23, 59, 59, 999)
    } else {
      // Caso contrário, usar últimos 15 dias
      endDate = new Date()
      startDate = new Date()
      startDate.setDate(endDate.getDate() - 15)
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
    }

    // Buscar transactions dos últimos 15 dias
    const transactions = await prisma.transaction.findMany({
      where: {
        created_by: authenticatedUser.id,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Buscar inadimplências dos últimos 15 dias
    const inadimplencias = await prisma.inadimplencia.findMany({
      where: {
        created_by: authenticatedUser.id,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Buscar transações de pagamento de inadimplências dos últimos 15 dias
    const inadimplenciaPayments = await prisma.transaction.findMany({
      where: {
        created_by: authenticatedUser.id,
        inadimplencia_id: {
          not: null
        },
        status: 'PAYED',
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Calcular métricas do período
    let entradaMes = 0
    let saidaMes = 0
    let totalGramsPeriodo = 0
    const processedInadimplencias = new Set<number>() // Para evitar contar gramas duplicadas
    
    const grafico15Dias: Array<{
      date: string;
      entrada: number;
      saida: number;
      inadimplenciaCriada: number;
      inadimplenciaPaga: number;
    }> = []

    // Agrupar por data
    const dailyData: Record<string, { 
      entrada: number; 
      saida: number;
      inadimplenciaCriada: number;
      inadimplenciaPaga: number;
    }> = {}

    // Calcular número de dias entre startDate e endDate
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Criar estrutura de dados para cada dia do período
    for (let i = 0; i <= diffDays; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      const dateKey = date.toISOString().split('T')[0]
      dailyData[dateKey] = { 
        entrada: 0, 
        saida: 0,
        inadimplenciaCriada: 0,
        inadimplenciaPaga: 0
      }
    }

    // Processar transactions (excluindo pagamentos de inadimplência)
    transactions.forEach(transaction => {
      const dateKey = transaction.createdAt.toISOString().split('T')[0]

      if (dailyData[dateKey]) {
        // Não contar transações que são pagamentos de inadimplência na entrada/saída normal
        if (!transaction.inadimplencia_id) {
          if (transaction.payment_type === 'IN' && transaction.status === 'PAYED') {
            entradaMes += transaction.amount
            dailyData[dateKey].entrada += transaction.amount
          } else if (transaction.payment_type === 'OUT' && transaction.status === 'PAYED') {
            saidaMes += transaction.amount
            dailyData[dateKey].saida += transaction.amount
          }
        }
        
        // Calcular gramas: somar apenas uma vez por inadimplencia_id
        if (transaction.grams && transaction.status === 'PAYED') {
          if (transaction.inadimplencia_id) {
            // Se tem inadimplencia_id, só soma se ainda não foi processada
            if (!processedInadimplencias.has(transaction.inadimplencia_id)) {
              totalGramsPeriodo += transaction.grams
              processedInadimplencias.add(transaction.inadimplencia_id)
            }
          } else {
            // Se não tem inadimplencia_id, soma normalmente
            totalGramsPeriodo += transaction.grams
          }
        }
      }
    })

    // Processar inadimplências criadas
    inadimplencias.forEach(inadimplencia => {
      const dateKey = inadimplencia.createdAt.toISOString().split('T')[0]
      
      if (dailyData[dateKey]) {
        dailyData[dateKey].inadimplenciaCriada += inadimplencia.amount
      }
    })

    // Processar pagamentos de inadimplências
    inadimplenciaPayments.forEach(payment => {
      const dateKey = payment.createdAt.toISOString().split('T')[0]
      
      if (dailyData[dateKey]) {
        dailyData[dateKey].inadimplenciaPaga += payment.amount
      }
    })

    // Converter para array do gráfico
    Object.entries(dailyData).forEach(([date, values]) => {
      grafico15Dias.push({
        date,
        entrada: values.entrada,
        saida: values.saida,
        inadimplenciaCriada: values.inadimplenciaCriada,
        inadimplenciaPaga: values.inadimplenciaPaga
      })
    })

    // Ordenar por data
    grafico15Dias.sort((a, b) => a.date.localeCompare(b.date))

    // Calcular métricas gerais
    const totalTransactions = await prisma.transaction.count({
      where: { created_by: authenticatedUser.id }
    })

    const transactionsPagas = await prisma.transaction.count({
      where: {
        created_by: authenticatedUser.id,
        status: 'PAYED'
      }
    })

    const transactionsPendentes = await prisma.transaction.count({
      where: {
        created_by: authenticatedUser.id,
        status: 'PENDING'
      }
    })

    const clientesAtivos = await prisma.customer.count({
      where: {
        created_by: authenticatedUser.id
      }
    })

    // Calcular inadimplência atual (soma dos saldos devedores)
    const inadimplenciasAtuais = await prisma.inadimplencia.findMany({
      where: {
        created_by: authenticatedUser.id,
        payed: false
      }
    })

    const inadimplenciaAtual = inadimplenciasAtuais.reduce((sum, item) => {
      const saldoDevedor = item.amount - item.amount_payed
      return sum + saldoDevedor
    }, 0)

    // Calcular número de clientes inadimplentes (com saldo devedor > 0)
    const clientesInadimplentesIds = new Set<number>()
    inadimplenciasAtuais.forEach(item => {
      const saldoDevedor = item.amount - item.amount_payed
      if (saldoDevedor > 0 && item.customer_id) {
        clientesInadimplentesIds.add(item.customer_id)
      }
    })
    const clientesInadimplentes = clientesInadimplentesIds.size

    // Calcular saldo (recebido - pendente)
    const totalRecebido = entradaMes
    const saldo = totalRecebido - inadimplenciaAtual

    // Saldo base + entradas - saídas - inadimplência
    const totalCaixa = 50000 + totalRecebido - saidaMes - inadimplenciaAtual

    const financialData: FinancialData = {
      totalCaixa,
      entradaMes,
      saidaMes,
      inadimplenciaAtual,
      saldo,
      grafico15Dias,
      clientesAtivos,
      clientesInadimplentes,
      transactionsTotal: totalTransactions,
      transactionsPendentes,
      transactionsPagas,
      totalGramsPeriodo
    }

    const response: APIResponse<FinancialData> = {
      success: true,
      data: financialData
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao buscar dados financeiros:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível buscar os dados financeiros'
        }
      },
      { status: 500 }
    )
  }
}
