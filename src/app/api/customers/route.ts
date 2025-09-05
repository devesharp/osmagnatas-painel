import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Customer, CreateCustomerRequest, CustomersSearchFilters, APIResponse, APIResponseSearch, PersonType } from '@/types/customer'
import { verifyToken, getUserById } from '@/lib/auth'
import { LoggerService } from '@/lib/logger'
import bcrypt from 'bcryptjs'

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

// GET /api/customers - Listar customers com filtros
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
    const person_type = searchParams.get('person_type') as PersonType | undefined
    const name = searchParams.get('name') || undefined
    const email = searchParams.get('email') || undefined

    // Construir filtros
    const where: Record<string, any> = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search, mode: 'insensitive' } },
        { cnpj: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (person_type) {
      where.person_type = person_type
    }

    if (name) {
      where.name = { contains: name, mode: 'insensitive' }
    }

    if (email) {
      where.email = { contains: email, mode: 'insensitive' }
    }

    // Buscar customers
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: {
          [sort.replace('-', '')]: sort.startsWith('-') ? 'desc' : 'asc'
        },
        take: limit,
        skip: offset,
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              user_name: true
            }
          }
        }
      }),
      prisma.customer.count({ where })
    ])

    const response: APIResponseSearch<Customer> = {
      results: customers,
      count: customers.length,
      total
    }

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error) {
    console.error('Erro ao buscar customers:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível buscar os customers'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/customers - Criar novo customer
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await authenticateUser(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const authenticatedUser = authResult

    const body: Omit<CreateCustomerRequest, 'created_by'> = await request.json()

    // Validar dados obrigatórios
    if (!body.name) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Dados inválidos',
            message: 'Nome, email e tipo pessoa são obrigatórios'
          }
        },
        { status: 400 }
      )
    }

    // Criar customer
    const customer = await prisma.customer.create({
      data: {
        name: body.name,
        person_type: body.person_type,
        email: body.email ?? '',
        phone: body.phone,
        wallet_address: body.wallet_address,
        cpf: body.cpf,
        cnpj: body.cnpj,
        access_website: body.access_website,
        access_email: body.access_email,
        access_password: body.access_password,
        created_by: authenticatedUser.id,
      },
      include: {
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
    await LoggerService.logCreateCustomer(
      authenticatedUser.id,
      authenticatedUser.user_name || authenticatedUser.email,
      customer.id,
      customer.name
    )

    const response: APIResponse<Customer> = {
      success: true,
      data: customer
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar customer:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível criar o customer'
        }
      },
      { status: 500 }
    )
  }
}
