import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { User, CreateUserRequest, UsersSearchFilters, APIResponse, APIResponseSearch } from '@/types/user'

// GET /api/users - Listar usuários com filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Extrair parâmetros de busca
    const search = searchParams.get('search') || undefined
    const sort = searchParams.get('sort') || 'createdAt'
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const ativo = searchParams.get('ativo') === 'true' ? true :
                  searchParams.get('ativo') === 'false' ? false : undefined
    const user_name = searchParams.get('user_name') || undefined
    const email = searchParams.get('email') || undefined

    // Construir filtros
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { user_name: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (ativo !== undefined) {
      where.ativo = ativo
    }

    if (user_name) {
      where.user_name = { contains: user_name, mode: 'insensitive' }
    }

    if (email) {
      where.email = { contains: email, mode: 'insensitive' }
    }

    // Buscar usuários
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: {
          [sort.replace('-', '')]: sort.startsWith('-') ? 'desc' : 'asc'
        },
        take: limit,
        skip: offset,
        include: {
          posts: {
            select: {
              id: true,
              title: true,
              published: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ])

    const response: APIResponseSearch<User> = {
      results: users,
      count: users.length,
      total
    }

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível buscar os usuários'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/users - Criar novo usuário
export async function POST(request: NextRequest) {
  try {
    const body: CreateUserRequest = await request.json()

    // Validar dados obrigatórios
    if (!body.email) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Dados inválidos',
            message: 'Email é obrigatório'
          }
        },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Dados inválidos',
            message: 'Email já cadastrado'
          }
        },
        { status: 400 }
      )
    }

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: body.email,
        user_name: body.user_name,
        ativo: body.ativo ?? true,
        telefone: body.telefone,
      },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            published: true
          }
        }
      }
    })

    const response: APIResponse<User> = {
      success: true,
      data: user
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível criar o usuário'
        }
      },
      { status: 500 }
    )
  }
}
