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

    // Simular dados financeiros do cliente (em produção, isso viria de uma query complexa)
    const now = new Date();
    const graficoDias = [];

    // Gerar dados para os últimos 30 dias
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);

      // Gerar valores aleatórios mas realistas para este cliente
      const entrada = Math.floor(Math.random() * 3000) + 500; // 500-3500
      const saida = Math.floor(Math.random() * 1500) + 200;     // 200-1700

      graficoDias.push({
        date: date.toISOString().split('T')[0],
        entrada,
        saida
      });
    }

    // Calcular métricas baseadas nos dados do gráfico
    const entradaMes = graficoDias.reduce((sum, item) => sum + item.entrada, 0);
    const saidaMes = graficoDias.reduce((sum, item) => sum + item.saida, 0);

    const financialData: CustomerFinancialData = {
      totalCaixa: entradaMes - saidaMes + 10000, // Saldo base do cliente
      entradaMes,
      saidaMes,
      inadimplenciaAtual: Math.floor(Math.random() * 500) + 100, // 100-600
      saldo: entradaMes - saidaMes,
      grafico30Dias: graficoDias,
      transactionsTotal: graficoDias.length * 2,
      transactionsPendentes: Math.floor(Math.random() * 3) + 1, // 1-4 pendentes
      transactionsPagas: graficoDias.length * 2 - (Math.floor(Math.random() * 3) + 1)
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

