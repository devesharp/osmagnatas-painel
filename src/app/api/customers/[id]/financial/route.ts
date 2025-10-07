import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { APIResponse } from '@/types/customer'
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

// Interface para dados financeiros do cliente
interface CustomerFinancialData {
  totalCaixa: number;
  entradaMes: number;
  saidaMes: number;
  inadimplenciaAtual: number;
  saldo: number;
  grafico30Dias: Array<{
    date: string;
    entrada: number;
    saida: number;
    inadimplenciaCriada: number;
    inadimplenciaPaga: number;
  }>;
  transactionsTotal: number;
  transactionsPendentes: number;
  transactionsPagas: number;
}

// GET /api/customers/[id]/financial - Buscar dados financeiros do cliente por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const authResult = await authenticateUser(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'ID inválido',
            message: 'O ID deve ser um número válido'
          }
        },
        { status: 400 }
      )
    }

    // Verificar se customer existe
    const customer = await prisma.customer.findUnique({
      where: { id }
    })

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Cliente não encontrado',
            message: 'Não foi possível encontrar o cliente com o ID especificado'
          }
        },
        { status: 404 }
      )
    }

    // Buscar dados reais do cliente
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Buscar transações dos últimos 30 dias
    const transactions = await prisma.transaction.findMany({
      where: {
        customer_id: id,
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Buscar inadimplências dos últimos 30 dias
    const inadimplencias = await prisma.inadimplencia.findMany({
      where: {
        customer_id: id,
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Buscar transações de pagamento de inadimplências (para calcular pagamentos por dia)
    const inadimplenciaPayments = await prisma.transaction.findMany({
      where: {
        customer_id: id,
        inadimplencia_id: {
          not: null
        },
        status: 'PAYED',
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Criar estrutura de dados por dia
    const dailyData: Record<string, {
      entrada: number;
      saida: number;
      inadimplenciaCriada: number;
      inadimplenciaPaga: number;
    }> = {};

    // Inicializar todos os dias dos últimos 30 dias
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      dailyData[dateStr] = {
        entrada: 0,
        saida: 0,
        inadimplenciaCriada: 0,
        inadimplenciaPaga: 0
      };
    }

    // Processar transações (excluindo pagamentos de inadimplência para evitar duplicação)
    transactions.forEach(transaction => {
      const dateStr = new Date(transaction.createdAt).toISOString().split('T')[0];
      
      if (dailyData[dateStr]) {
        // Não contar transações que são pagamentos de inadimplência na entrada/saída normal
        if (!transaction.inadimplencia_id) {
          if (transaction.payment_type === 'IN' && transaction.status === 'PAYED') {
            dailyData[dateStr].entrada += transaction.amount;
          } else if (transaction.payment_type === 'OUT' && transaction.status === 'PAYED') {
            dailyData[dateStr].saida += transaction.amount;
          }
        }
      }
    });

    // Processar inadimplências criadas
    inadimplencias.forEach(inadimplencia => {
      const dateCreatedStr = new Date(inadimplencia.createdAt).toISOString().split('T')[0];
      
      // Adicionar ao dia de criação
      if (dailyData[dateCreatedStr]) {
        dailyData[dateCreatedStr].inadimplenciaCriada += inadimplencia.amount;
      }
    });

    // Processar pagamentos de inadimplências
    inadimplenciaPayments.forEach(payment => {
      const dateStr = new Date(payment.createdAt).toISOString().split('T')[0];
      
      if (dailyData[dateStr]) {
        dailyData[dateStr].inadimplenciaPaga += payment.amount;
      }
    });

    // Converter para array
    const graficoDias = Object.entries(dailyData).map(([date, values]) => ({
      date,
      entrada: values.entrada,
      saida: values.saida,
      inadimplenciaCriada: values.inadimplenciaCriada,
      inadimplenciaPaga: values.inadimplenciaPaga
    }));

    // Ordenar por data
    graficoDias.sort((a, b) => a.date.localeCompare(b.date));

    // Calcular métricas baseadas nos dados
    const entradaMes = graficoDias.reduce((sum, item) => sum + item.entrada, 0);
    const saidaMes = graficoDias.reduce((sum, item) => sum + item.saida, 0);

    // Buscar inadimplência atual (não pagas completamente)
    const inadimplenciaAtualData = await prisma.inadimplencia.findMany({
      where: {
        customer_id: id,
        payed: false
      }
    });

    // Calcular saldo devedor real (amount - amount_payed)
    const inadimplenciaAtual = inadimplenciaAtualData.reduce((sum, item) => {
      const saldoDevedor = item.amount - item.amount_payed;
      return sum + saldoDevedor;
    }, 0);

    // Buscar contadores de transações
    const transactionsTotal = await prisma.transaction.count({
      where: { customer_id: id }
    });

    const transactionsPagas = await prisma.transaction.count({
      where: {
        customer_id: id,
        status: 'PAYED'
      }
    });

    const transactionsPendentes = await prisma.transaction.count({
      where: {
        customer_id: id,
        status: 'PENDING'
      }
    });

    const financialData: CustomerFinancialData = {
      totalCaixa: entradaMes - saidaMes,
      entradaMes,
      saidaMes,
      inadimplenciaAtual,
      saldo: entradaMes - saidaMes,
      grafico30Dias: graficoDias,
      transactionsTotal,
      transactionsPendentes,
      transactionsPagas
    }

    const response: APIResponse<CustomerFinancialData> = {
      success: true,
      data: financialData
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao buscar dados financeiros do cliente:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível buscar os dados financeiros do cliente'
        }
      },
      { status: 500 }
    )
  }
}

