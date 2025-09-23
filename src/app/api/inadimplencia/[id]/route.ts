import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Inadimplencia, UpdateInadimplenciaRequest, APIResponse } from '@/types/inadimplencia'
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

// GET /api/inadimplencia/[id] - Buscar inadimplência por ID
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

    const inadimplencia = await prisma.inadimplencia.findUnique({
      where: { id },
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

    if (!inadimplencia) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Inadimplência não encontrada',
            message: 'Não foi possível encontrar a inadimplência com o ID especificado'
          }
        },
        { status: 404 }
      )
    }

    // Registrar log de visualização
    const authenticatedUser = await authenticateUser(request)
    if (authenticatedUser instanceof NextResponse) {
      return authenticatedUser
    }

    await LoggerService.logViewInadimplencia(
      authenticatedUser.id,
      authenticatedUser.user_name || authenticatedUser.email,
      inadimplencia.id
    )

    const response: APIResponse<Inadimplencia> = {
      success: true,
      data: inadimplencia
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao buscar inadimplência:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível buscar a inadimplência'
        }
      },
      { status: 500 }
    )
  }
}

// PUT /api/inadimplencia/[id] - Atualizar inadimplência
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

    const authenticatedUser = authResult
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

    const body: UpdateInadimplenciaRequest = await request.json()

    // Verificar se inadimplência existe
    const existingInadimplencia = await prisma.inadimplencia.findUnique({
      where: { id }
    })

    if (!existingInadimplencia) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Inadimplência não encontrada',
            message: 'Não foi possível encontrar a inadimplência com o ID especificado'
          }
        },
        { status: 404 }
      )
    }

    // Verificar se customer existe (se foi fornecido)
    if (body.customer_id) {
      const customer = await prisma.customer.findUnique({
        where: { id: body.customer_id }
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
    }

    // Atualizar inadimplência
    const inadimplencia = await prisma.inadimplencia.update({
      where: { id },
      data: {
        ...(body.customer_id && { customer_id: body.customer_id }),
        ...(body.amount && { amount: body.amount }),
        ...(body.payed !== undefined && { payed: body.payed }),
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

    // Registrar log de atualização
    await LoggerService.logUpdateInadimplencia(
      authenticatedUser.id,
      authenticatedUser.user_name || authenticatedUser.email,
      inadimplencia.id,
      inadimplencia.amount
    )

    const response: APIResponse<Inadimplencia> = {
      success: true,
      data: inadimplencia
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao atualizar inadimplência:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível atualizar a inadimplência'
        }
      },
      { status: 500 }
    )
  }
}

// DELETE /api/inadimplencia/[id] - Deletar inadimplência
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

    const authenticatedUser = authResult
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

    // Verificar se inadimplência existe
    const existingInadimplencia = await prisma.inadimplencia.findUnique({
      where: { id }
    })

    if (!existingInadimplencia) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Inadimplência não encontrada',
            message: 'Não foi possível encontrar a inadimplência com o ID especificado'
          }
        },
        { status: 404 }
      )
    }

    // Salvar dados antes de deletar para o log
    const inadimplenciaToDelete = await prisma.inadimplencia.findUnique({
      where: { id }
    })

    // Deletar inadimplência
    await prisma.inadimplencia.delete({
      where: { id }
    })

    // Registrar log de exclusão
    await LoggerService.logDeleteInadimplencia(
      authenticatedUser.id,
      authenticatedUser.user_name || authenticatedUser.email,
      id,
      inadimplenciaToDelete?.amount || 0
    )

    const response: APIResponse<null> = {
      success: true,
      data: null
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao deletar inadimplência:', error)

    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível deletar a inadimplência'
        }
      },
      { status: 500 }
    )
  }
}
