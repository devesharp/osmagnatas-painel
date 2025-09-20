import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Customer, APIResponse } from '@/types/customer'
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

// Interface para dados de resumo do cliente
interface CustomerResumeData {
  id: number
  name: string
  email: string
  phone?: string | null
  person_type: 'PF' | 'PJ'
  cpf?: string | null
  cnpj?: string | null
  wallet_address?: string | null
  access_website?: string | null
  access_email?: string | null
  created_at: string
  updated_at: string
  creator?: {
    id: number
    email: string
    user_name: string
  } | null
}

// GET /api/customers/[id]/resume - Buscar resumo do cliente por ID
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

    const customer = await prisma.customer.findUnique({
      where: { id },
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

    const resumeData: CustomerResumeData = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      person_type: customer.person_type,
      cpf: customer.cpf,
      cnpj: customer.cnpj,
      wallet_address: customer.wallet_address,
      access_website: customer.access_website,
      access_email: customer.access_email,
      created_at: customer.created_at.toISOString(),
      updated_at: customer.updated_at.toISOString(),
      creator: customer.creator
    }

    const response: APIResponse<CustomerResumeData> = {
      success: true,
      data: resumeData
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao buscar resumo do cliente:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível buscar o resumo do cliente'
        }
      },
      { status: 500 }
    )
  }
}
