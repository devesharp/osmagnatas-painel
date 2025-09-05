import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserById } from '@/lib/auth'
import { APIResponse } from '@/api/base'

// Tipo DateTime para consistência com Prisma
type DateTime = Date

// Interface AuthUser consistente com o modelo User do schema Prisma
interface AuthUser {
  id: number
  email: string
  user_name?: string | null
  password?: string | null
  ativo: boolean
  telefone?: string | null
  createdAt: DateTime
  updatedAt: DateTime
  access_token: string
}

interface AuthResponse {
  user: AuthUser
}

// Função auxiliar para extrair token do header Authorization
function getTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7) // Remove "Bearer " prefix
}

// GET /api/auth/me
export async function GET(request: NextRequest) {
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

    // Mapear usuário para o formato consistente com schema Prisma
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      user_name: user.user_name,
      password: user.password,
      ativo: user.ativo,
      telefone: user.telefone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      access_token: token
    }

    const response: APIResponse<AuthResponse> = {
      success: true,
      data: {
        user: authUser
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível obter os dados do usuário'
        }
      },
      { status: 500 }
    )
  }
}
