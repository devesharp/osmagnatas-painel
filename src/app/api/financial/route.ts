import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { FinancialData, APIResponse } from '@/types/financial'
import { verifyToken, getUserById } from '@/lib/auth'

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

    // Buscar dados dos últimos 15 dias
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 15)

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

    // Calcular métricas dos últimos 15 dias
    let entradaMes = 0
    let saidaMes = 0
    const grafico15Dias: Array<{
      date: string;
      entrada: number;
      saida: number;
    }> = []

    // Agrupar por data
    const dailyData: Record<string, { entrada: number; saida: number }> = {}

    for (let i = 14; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      dailyData[dateKey] = { entrada: 0, saida: 0 }
    }

    // Processar transactions
    transactions.forEach(transaction => {
      const dateKey = transaction.createdAt.toISOString().split('T')[0]

      if (transaction.payment_type === 'IN') {
        // Entrada - sempre positivo
        entradaMes += transaction.amount
        if (dailyData[dateKey]) {
          dailyData[dateKey].entrada += transaction.amount
        }
      } else if (transaction.payment_type === 'OUT') {
        // Saída - sempre negativo
        saidaMes += transaction.amount
        if (dailyData[dateKey]) {
          dailyData[dateKey].saida += transaction.amount
        }
      }
    })

    // Converter para array do gráfico
    Object.entries(dailyData).forEach(([date, values]) => {
      grafico15Dias.push({
        date,
        entrada: values.entrada,
        saida: values.saida
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

    // Calcular inadimplência (transactions pendentes dos últimos 30 dias)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const pendentes30Dias = await prisma.transaction.findMany({
      where: {
        created_by: authenticatedUser.id,
        status: 'PENDING',
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    const inadimplenciaAtual = pendentes30Dias.reduce((sum, t) => sum + t.amount, 0)

    // Calcular saldo (recebido - pendente - cancelado)
    const totalRecebido = entradaMes
    const totalPendente = pendentes30Dias.reduce((sum, t) => sum + t.amount, 0)
    const saldo = totalRecebido - totalPendente

    // Saldo base + entradas - inadimplência
    const totalCaixa = 50000 + totalRecebido - inadimplenciaAtual

    const financialData: FinancialData = {
      totalCaixa,
      entradaMes,
      saidaMes,
      inadimplenciaAtual,
      saldo,
      grafico15Dias,
      clientesAtivos,
      transactionsTotal: totalTransactions,
      transactionsPendentes,
      transactionsPagas
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
