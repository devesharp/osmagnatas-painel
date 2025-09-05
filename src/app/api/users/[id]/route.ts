import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { User, UpdateUserRequest, APIResponse } from '@/types/user'

// GET /api/users/[id] - Buscar usuário por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            published: true,
            createdAt: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Usuário não encontrado',
            message: 'Não foi possível encontrar o usuário com o ID especificado'
          }
        },
        { status: 404 }
      )
    }

    const response: APIResponse<User> = {
      success: true,
      data: user
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível buscar o usuário'
        }
      },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id] - Atualizar usuário
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    const body: UpdateUserRequest = await request.json()

    // Verificar se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Usuário não encontrado',
            message: 'Não foi possível encontrar o usuário com o ID especificado'
          }
        },
        { status: 404 }
      )
    }

    // Verificar se email já existe (se foi fornecido)
    if (body.email && body.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
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

    // Atualizar usuário
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(body.email && { email: body.email }),
        ...(body.user_name !== undefined && { user_name: body.user_name }),
        ...(body.ativo !== undefined && { ativo: body.ativo }),
        ...(body.user_name !== undefined && { user_name: body.user_name }),
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

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível atualizar o usuário'
        }
      },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - Deletar usuário
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Verificar se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Usuário não encontrado',
            message: 'Não foi possível encontrar o usuário com o ID especificado'
          }
        },
        { status: 404 }
      )
    }

    // Deletar usuário (isso também vai deletar os posts relacionados devido ao cascade)
    await prisma.user.delete({
      where: { id }
    })

    const response: APIResponse<null> = {
      success: true,
      data: null
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao deletar usuário:', error)

    // Verificar se é erro de constraint (usuário tem dependências)
    if (error instanceof Error && error.message.includes('Foreign key constraint')) {
      return NextResponse.json(
        {
          success: false,
          data: {
            error: 'Não é possível deletar',
            message: 'O usuário possui dependências que impedem a exclusão'
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
          message: 'Não foi possível deletar o usuário'
        }
      },
      { status: 500 }
    )
  }
}
