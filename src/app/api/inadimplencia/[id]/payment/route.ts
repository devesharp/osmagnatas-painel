import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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

interface PaymentRequest {
  amount: number
  moeda?: string
  notes?: string
}

// POST /api/inadimplencia/[id]/payment - Criar pagamento para inadimplência
export async function POST(
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
    const inadimplenciaId = parseInt(params.id)

    if (isNaN(inadimplenciaId)) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'ID inválido',
            message: 'O ID da inadimplência deve ser um número válido'
          }
        },
        { status: 400 }
      )
    }

    const body: PaymentRequest = await request.json()

    // Validar dados obrigatórios
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Dados inválidos',
            message: 'O valor do pagamento deve ser maior que zero'
          }
        },
        { status: 400 }
      )
    }

    // Buscar inadimplência
    const inadimplencia = await prisma.inadimplencia.findUnique({
      where: { id: inadimplenciaId },
      include: {
        customer: true
      }
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

    // Verificar se o valor do pagamento não ultrapassa o saldo devedor
    const remainingAmount = inadimplencia.amount - inadimplencia.amount_payed
    if (body.amount > remainingAmount) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Valor inválido',
            message: `O valor do pagamento (${body.amount}) não pode ser maior que o saldo devedor (${remainingAmount})`
          }
        },
        { status: 400 }
      )
    }

    // Criar transação de pagamento e atualizar amount_payed em uma transação do banco
    const result = await prisma.$transaction(async (tx) => {
      // Criar a transação de pagamento
      const transaction = await tx.transaction.create({
        data: {
          customer_id: inadimplencia.customer_id,
          inadimplencia_id: inadimplenciaId,
          status: 'PAYED',
          payment_type: 'IN', // É uma entrada, pois o cliente está pagando
          notes: body.notes || `Pagamento de inadimplência #${inadimplenciaId}`,
          amount: body.amount,
          moeda: body.moeda || 'USD',
          payed_at: new Date(),
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

      // Atualizar o amount_payed da inadimplência
      const newAmountPayed = inadimplencia.amount_payed + body.amount
      const isPayed = newAmountPayed >= inadimplencia.amount

      const updatedInadimplencia = await tx.inadimplencia.update({
        where: { id: inadimplenciaId },
        data: {
          amount_payed: newAmountPayed,
          payed: isPayed
        }
      })

      return {
        transaction,
        inadimplencia: updatedInadimplencia
      }
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          transaction: result.transaction,
          inadimplencia: result.inadimplencia,
          message: `Pagamento de ${body.amount} registrado com sucesso`
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erro ao processar pagamento:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível processar o pagamento'
        }
      },
      { status: 500 }
    )
  }
}

