import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateToken, getUserByEmail } from '@/lib/auth'
import { APIResponse } from '@/api/base'
import { LoggerService } from '@/lib/logger'

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
  user: AuthUser,
  access_token: string
}

interface LoginRequest {
  login: string
  password: string
}

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()

    // Validar dados de entrada
    if (!body.login || !body.password) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Dados inválidos',
            message: 'Login e senha são obrigatórios'
          }
        },
        { status: 400 }
      )
    }

    // Buscar usuário por email
    const user = await getUserByEmail(body.login)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Credenciais inválidas',
            message: 'Email ou senha incorretos'
          }
        },
        { status: 401 }
      )
    }

    // Verificar se usuário está ativo
    if (!user.ativo) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Conta desativada',
            message: 'Sua conta está desativada. Entre em contato com o administrador.'
          }
        },
        { status: 401 }
      )
    }

    // Verificar senha
    if (!user.password) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Erro de autenticação',
            message: 'Usuário não possui senha cadastrada'
          }
        },
        { status: 401 }
      )
    }

    const isPasswordValid = await verifyPassword(body.password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Credenciais inválidas',
            message: 'Email ou senha incorretos'
          }
        },
        { status: 401 }
      )
    }

    // Gerar token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      is_admin: user.email === 'admin@example.com', // Admin baseado no email
      is_master: false,
    })

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

    // Registrar log de login
    await LoggerService.logLogin(user.id, user.user_name || user.email)

    const response: APIResponse<AuthResponse> = {
      success: true,
      data: {
        user: authUser,
        access_token: token
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível fazer login'
        }
      },
      { status: 500 }
    )
  }
}
