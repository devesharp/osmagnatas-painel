import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Transaction, CreateTransactionRequest, TransactionsSearchFilters, APIResponse, APIResponseSearch, TransactionStatus, PaymentType } from '@/types/transaction'
import { verifyToken, getUserById } from '@/lib/auth'
import { LoggerService } from '@/lib/logger'

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

// GET /api/transactions - Listar transactions com filtros
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await authenticateUser(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)

    // Extrair parâmetros de busca
    const search = searchParams.get('search') || undefined
    const sort = searchParams.get('sort') || 'createdAt'
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') as TransactionStatus | undefined
    const payment_type = searchParams.get('payment_type') as PaymentType | undefined
    const customer_id = searchParams.get('customer_id') ? parseInt(searchParams.get('customer_id')!) : undefined
    const moeda = searchParams.get('moeda') || undefined
    const amount_min = searchParams.get('amount_min') ? parseFloat(searchParams.get('amount_min')!) : undefined
    const amount_max = searchParams.get('amount_max') ? parseFloat(searchParams.get('amount_max')!) : undefined
    
    // Parâmetros de data - Função auxiliar para converter dd/MM/yyyy para Date
    const parseDate = (dateString: string | null): Date | undefined => {
      if (!dateString) return undefined
      // Aceita tanto formato dd/MM/yyyy quanto yyyy-MM-dd
      if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/')
        return new Date(`${year}-${month}-${day}`)
      }
      return new Date(dateString)
    }

    const expired_at_start = parseDate(searchParams.get('expired_at_start'))
    const expired_at_end = parseDate(searchParams.get('expired_at_end'))
    const payed_at_start = parseDate(searchParams.get('payed_at_start'))
    const payed_at_end = parseDate(searchParams.get('payed_at_end'))
    const created_at_start = parseDate(searchParams.get('created_at_start'))
    const created_at_end = parseDate(searchParams.get('created_at_end'))

    // Construir filtros
    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { notes: { contains: search } },
        { customer: {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } }
          ]
        }}
      ]
    }

    if (status) {
      where.status = status
    }

    if (payment_type) {
      where.payment_type = payment_type
    }

    if (customer_id) {
      where.customer_id = customer_id
    }

    if (moeda) {
      where.moeda = moeda
    }

    if (amount_min !== undefined || amount_max !== undefined) {
      const amountFilter: Record<string, number> = {}
      if (amount_min !== undefined) {
        amountFilter.gte = amount_min
      }
      if (amount_max !== undefined) {
        amountFilter.lte = amount_max
      }
      where.amount = amountFilter
    }

    // Filtros de data de vencimento
    if (expired_at_start || expired_at_end) {
      const expiredAtFilter: Record<string, Date> = {}
      if (expired_at_start) {
        expiredAtFilter.gte = expired_at_start
      }
      if (expired_at_end) {
        const endDate = new Date(expired_at_end)
        endDate.setHours(23, 59, 59, 999)
        expiredAtFilter.lte = endDate
      }
      where.expired_at = expiredAtFilter
    }

    // Filtros de data de pagamento
    if (payed_at_start || payed_at_end) {
      const payedAtFilter: Record<string, Date> = {}
      if (payed_at_start) {
        payedAtFilter.gte = payed_at_start
      }
      if (payed_at_end) {
        const endDate = new Date(payed_at_end)
        endDate.setHours(23, 59, 59, 999)
        payedAtFilter.lte = endDate
      }
      where.payed_at = payedAtFilter
    }

    // Filtros de data de criação
    if (created_at_start || created_at_end) {
      const createdAtFilter: Record<string, Date> = {}
      if (created_at_start) {
        createdAtFilter.gte = created_at_start
      }
      if (created_at_end) {
        const endDate = new Date(created_at_end)
        endDate.setHours(23, 59, 59, 999)
        createdAtFilter.lte = endDate
      }
      where.createdAt = createdAtFilter
    }

    // Buscar transactions
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: {
          [sort.replace('-', '')]: sort.startsWith('-') ? 'desc' : 'asc'
        },
        take: limit,
        skip: offset,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          creator: {
            select: {
              id: true,
              email: true,
              user_name: true
            }
          },
          inadimplencia: {
            select: {
              id: true,
              amount: true,
              amount_payed: true
            }
          }
        }
      }),
      prisma.transaction.count({ where })
    ])

    const response: APIResponseSearch<Transaction> = {
      results: transactions,
      count: transactions.length,
      total
    }

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error) {
    console.error('Erro ao buscar transactions:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível buscar as transactions'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/transactions - Criar nova transaction
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await authenticateUser(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const authenticatedUser = authResult

    const body: Omit<CreateTransactionRequest, 'created_by'> = await request.json()

    // Validar dados obrigatórios
    if (!body.customer_id || !body.amount) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Dados inválidos',
            message: 'Customer ID e amount são obrigatórios'
          }
        },
        { status: 400 }
      )
    }

    // Verificar se customer existe
    const customer = await prisma.customer.findFirst({
      where: { id: Number(body.customer_id) }
    })

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Customer não encontrado',
            message: 'O customer especificado não existe'
          }
        },
        { status: 404 }
      )
    }

    // Verificar se inadimplência existe (se foi fornecida)
    if (body.inadimplencia_id) {
      const inadimplencia = await prisma.inadimplencia.findUnique({
        where: { id: Number(body.inadimplencia_id) }
      })

      if (!inadimplencia) {
        return NextResponse.json(
          {
            success: false,
            data: {
              error: 'Inadimplência não encontrada',
              message: 'A inadimplência especificada não existe'
            }
          },
          { status: 404 }
        )
      }

      // Verificar se a inadimplência pertence ao mesmo customer
      if (inadimplencia.customer_id !== Number(body.customer_id)) {
        return NextResponse.json(
          {
            success: false,
            data: {
              error: 'Inadimplência inválida',
              message: 'A inadimplência não pertence ao customer especificado'
            }
          },
          { status: 400 }
        )
      }
    }

    // Criar transaction
    const transaction = await prisma.transaction.create({
      data: {
        customer_id: Number(body.customer_id),
        inadimplencia_id: body.inadimplencia_id ? Number(body.inadimplencia_id) : null,
        status: body.status || 'PENDING',
        payment_type: body.payment_type || 'OUT',
        notes: body.notes,
        amount: body.amount,
        moeda: body.moeda || 'USD',
        expired_at: body.expired_at ? new Date(body.expired_at) : null,
        payed_at: body.payed_at ? new Date(body.payed_at) : null,
        created_by: authenticatedUser.id,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        creator: {
          select: {
            id: true,
            email: true,
            user_name: true
          }
        },
        inadimplencia: {
          select: {
            id: true,
            amount: true,
            amount_payed: true
          }
        }
      }
    })

    // Registrar log de criação
    await LoggerService.logCreateTransaction(
      authenticatedUser.id,
      authenticatedUser.user_name || authenticatedUser.email,
      transaction.id,
      transaction.amount
    )

    const response: APIResponse<Transaction> = {
      success: true,
      data: transaction
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar transaction:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível criar a transaction'
        }
      },
      { status: 500 }
    )
  }
}
