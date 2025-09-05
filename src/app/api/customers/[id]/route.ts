import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Customer, UpdateCustomerRequest, APIResponse, PersonType } from '@/types/customer'
import { verifyToken, getUserById } from '@/lib/auth'
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

// GET /api/customers/[id] - Buscar customer por ID
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
            error: 'Customer não encontrado',
            message: 'Não foi possível encontrar o customer com o ID especificado'
          }
        },
        { status: 404 }
      )
    }

    const response: APIResponse<Customer> = {
      success: true,
      data: customer
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao buscar customer:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível buscar o customer'
        }
      },
      { status: 500 }
    )
  }
}

// PUT /api/customers/[id] - Atualizar customer
export async function PUT(
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

    const body: UpdateCustomerRequest = await request.json()

    // Verificar se customer existe
    const existingCustomer = await prisma.customer.findUnique({
      where: { id }
    })

    if (!existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Customer não encontrado',
            message: 'Não foi possível encontrar o customer com o ID especificado'
          }
        },
        { status: 404 }
      )
    }

    // Verificar se email já existe (se foi fornecido)
    if (body.email && body.email !== existingCustomer.email) {
      const emailExists = await prisma.customer.findUnique({
        where: { email: body.email }
      })

      if (emailExists) {
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
    }

    // Validar CPF/CNPJ baseado no tipo de pessoa
    const personType = body.person_type || existingCustomer.person_type
    if (personType === 'PF' && body.cpf === undefined && !existingCustomer.cpf) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Dados inválidos',
            message: 'CPF é obrigatório para pessoa física'
          }
        },
        { status: 400 }
      )
    }

    if (personType === 'PJ' && body.cnpj === undefined && !existingCustomer.cnpj) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Dados inválidos',
            message: 'CNPJ é obrigatório para pessoa jurídica'
          }
        },
        { status: 400 }
      )
    }

    // Criptografar nova senha se fornecida
    let hashedPassword = existingCustomer.access_password
    if (body.access_password) {
      const saltRounds = 10
      hashedPassword = await bcrypt.hash(body.access_password, saltRounds)
    }

    // Atualizar customer
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.person_type && { person_type: body.person_type }),
        ...(body.email && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.wallet_address !== undefined && { wallet_address: body.wallet_address }),
        ...(body.cpf !== undefined && { cpf: body.cpf }),
        ...(body.cnpj !== undefined && { cnpj: body.cnpj }),
        ...(body.access_website !== undefined && { access_website: body.access_website }),
        ...(body.access_email !== undefined && { access_email: body.access_email }),
        ...(body.access_password && { access_password: hashedPassword }),
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

    const response: APIResponse<Customer> = {
      success: true,
      data: customer
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao atualizar customer:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível atualizar o customer'
        }
      },
      { status: 500 }
    )
  }
}

// DELETE /api/customers/[id] - Deletar customer
export async function DELETE(
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
    const existingCustomer = await prisma.customer.findUnique({
      where: { id }
    })

    if (!existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Customer não encontrado',
            message: 'Não foi possível encontrar o customer com o ID especificado'
          }
        },
        { status: 404 }
      )
    }

    // Deletar customer
    await prisma.customer.delete({
      where: { id }
    })

    const response: APIResponse<null> = {
      success: true,
      data: null
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao deletar customer:', error)

    // Verificar se é erro de constraint (customer tem dependências)
    if (error instanceof Error && error.message.includes('Foreign key constraint')) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Não é possível deletar',
            message: 'O customer possui dependências que impedem a exclusão'
          }
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível deletar o customer'
        }
      },
      { status: 500 }
    )
  }
}
