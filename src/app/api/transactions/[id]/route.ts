import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Transaction, UpdateTransactionRequest, APIResponse, TransactionStatus } from '@/types/transaction'
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

// GET /api/transactions/[id] - Buscar transaction por ID
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

    const transaction = await prisma.transaction.findUnique({
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

    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Transaction não encontrada',
            message: 'Não foi possível encontrar a transaction com o ID especificado'
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

    await LoggerService.logViewTransaction(
      authenticatedUser.id,
      authenticatedUser.user_name || authenticatedUser.email,
      transaction.id
    )

    const response: APIResponse<Transaction> = {
      success: true,
      data: transaction
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao buscar transaction:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível buscar a transaction'
        }
      },
      { status: 500 }
    )
  }
}

// PUT /api/transactions/[id] - Atualizar transaction
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

    const body: UpdateTransactionRequest = await request.json()

    // Verificar se transaction existe
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id }
    })

    if (!existingTransaction) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Transaction não encontrada',
            message: 'Não foi possível encontrar a transaction com o ID especificado'
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

    // Verificar se inadimplência existe (se foi fornecida)
    if (body.inadimplencia_id !== undefined) {
      if (body.inadimplencia_id !== null) {
        const inadimplencia = await prisma.inadimplencia.findUnique({
          where: { id: body.inadimplencia_id }
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
        const customerId = body.customer_id || existingTransaction.customer_id
        if (inadimplencia.customer_id !== customerId) {
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
    }

    // Atualizar transaction
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...(body.customer_id && { customer_id: body.customer_id }),
        ...(body.inadimplencia_id !== undefined && { inadimplencia_id: body.inadimplencia_id }),
        ...(body.status && { status: body.status }),
        ...(body.payment_type && { payment_type: body.payment_type }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.amount && { amount: body.amount }),
        ...(body.moeda && { moeda: body.moeda }),
        ...(body.expired_at !== undefined && { expired_at: body.expired_at ? new Date(body.expired_at) : null }),
        ...(body.payed_at !== undefined && { payed_at: body.payed_at ? new Date(body.payed_at) : null }),
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

    // Registrar log de atualização
    await LoggerService.logUpdateTransaction(
      authResult.id,
      authResult.user_name || authResult.email,
      transaction.id,
      transaction.amount
    )

    const response: APIResponse<Transaction> = {
      success: true,
      data: transaction
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao atualizar transaction:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível atualizar a transaction'
        }
      },
      { status: 500 }
    )
  }
}

// DELETE /api/transactions/[id] - Deletar transaction
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

    // Verificar se transaction existe
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id }
    })

    if (!existingTransaction) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Transaction não encontrada',
            message: 'Não foi possível encontrar a transaction com o ID especificado'
          }
        },
        { status: 404 }
      )
    }

    // Salvar dados antes de deletar para o log
    const transactionToDelete = await prisma.transaction.findUnique({
      where: { id }
    })

    // Deletar transaction
    await prisma.transaction.delete({
      where: { id }
    })

    // Registrar log de exclusão
    await LoggerService.logDeleteTransaction(
      authResult.id,
      authResult.user_name || authResult.email,
      id,
      transactionToDelete?.amount || 0
    )

    const response: APIResponse<null> = {
      success: true,
      data: null
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao deletar transaction:', error)

    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível deletar a transaction'
        }
      },
      { status: 500 }
    )
  }
}
