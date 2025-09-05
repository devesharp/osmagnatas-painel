import { prisma } from './prisma'

// Exemplo de funções para usar o Prisma
export async function createUser(email: string, user_name?: string) {
  return await prisma.user.create({
    data: {
      email,
      user_name,
    },
  })
}

export async function getUsers() {
  return await prisma.user.findMany({
    include: {
      posts: true,
    },
  })
}

export async function createPost(title: string, content: string, authorId: number) {
  return await prisma.post.create({
    data: {
      title,
      content,
      authorId,
    },
  })
}

export async function getPosts() {
  return await prisma.post.findMany({
    include: {
      author: true,
    },
  })
}

// Exemplo de uso em uma API route do Next.js:
/*
import { NextResponse } from 'next/server'
import { createUser, getUsers } from '@/lib/prisma-example'

export async function GET() {
  try {
    const users = await getUsers()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()
    const user = await createUser(email, name)
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 })
  }
}
*/
