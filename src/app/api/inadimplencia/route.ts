import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Inadimplencia, CreateInadimplenciaRequest, InadimplenciaSearchFilters, APIResponse, APIResponseSearch } from '@/types/inadimplencia'
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

// GET /api/inadimplencia - Listar inadimplência com filtros
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
    // const payed = searchParams.get('payed') ? searchParams.get('payed') === 'true' : undefined
    const customer_id = searchParams.get('customer_id') ? parseInt(searchParams.get('customer_id')!) : undefined
    const amount_min = searchParams.get('amount_min') ? parseFloat(searchParams.get('amount_min')!) : undefined
    const amount_max = searchParams.get('amount_max') ? parseFloat(searchParams.get('amount_max')!) : undefined
    const grams_min = searchParams.get('grams_min') ? parseFloat(searchParams.get('grams_min')!) : undefined
    const grams_max = searchParams.get('grams_max') ? parseFloat(searchParams.get('grams_max')!) : undefined
    
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

    const created_at_start = parseDate(searchParams.get('created_at_start'))
    const created_at_end = parseDate(searchParams.get('created_at_end'))

    // Construir filtros
    const where: Record<string, any> = {}

    if (search) {
      where.OR = [
        { customer: {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } }
          ]
        }}
      ]
    }

    // if (payed !== undefined) {
    //   where.payed = payed
    // }

    if (customer_id) {
      where.customer_id = customer_id
    }

    if (amount_min !== undefined || amount_max !== undefined) {
      where.amount = {}
      if (amount_min !== undefined) {
        where.amount.gte = amount_min
      }
      if (amount_max !== undefined) {
        where.amount.lte = amount_max
      }
    }

    if (grams_min !== undefined || grams_max !== undefined) {
      where.grams = {}
      if (grams_min !== undefined) {
        where.grams.gte = grams_min
      }
      if (grams_max !== undefined) {
        where.grams.lte = grams_max
      }
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

    // Buscar inadimplências
    const [inadimplencias, total] = await Promise.all([
      prisma.inadimplencia.findMany({
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
          }
        }
      }),
      prisma.inadimplencia.count({ where })
    ])

    const response: APIResponseSearch<Inadimplencia> = {
      results: inadimplencias,
      count: inadimplencias.length,
      total
    }

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error) {
    console.error('Erro ao buscar inadimplências:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível buscar as inadimplências'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/inadimplencia - Criar nova inadimplência
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await authenticateUser(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const authenticatedUser = authResult

    const body: Omit<CreateInadimplenciaRequest, 'created_by'> = await request.json()

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

    // Criar inadimplência
    const inadimplencia = await prisma.inadimplencia.create({
      data: {
        customer_id: Number(body.customer_id),
        amount: body.amount,
        payed: body.payed || false,
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
        }
      }
    })

    // Registrar log de criação
    await LoggerService.logCreateInadimplencia(
      authenticatedUser.id,
      authenticatedUser.user_name || authenticatedUser.email,
      inadimplencia.id,
      inadimplencia.amount
    )

    const response: APIResponse<Inadimplencia> = {
      success: true,
      data: inadimplencia
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar inadimplência:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível criar a inadimplência'
        }
      },
      { status: 500 }
    )
  }
}
