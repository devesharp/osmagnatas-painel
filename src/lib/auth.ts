import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: number
  email: string
  is_admin: boolean
  is_master: boolean
}

// Hash de senha
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Verificar senha
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// Gerar token JWT
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET as string)
}

// Verificar token JWT
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

// Obter usuário por email
export async function getUserByEmail(email: string) {
  return await prisma.user.findFirst({
    where: { email },
    select: {
      id: true,
      email: true,
      user_name: true,
      password: true,
      ativo: true,
      telefone: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

// Obter usuário por ID
export async function getUserById(id: number) {
  return await prisma.user.findFirst({
    where: { id },
    select: {
      id: true,
      email: true,
      user_name: true,
      password: true,
      ativo: true,
      telefone: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

// Criar usuário admin padrão (para desenvolvimento)
export async function createDefaultAdmin() {
  try {
    const existingAdmin = await getUserByEmail('admin@example.com')

    if (!existingAdmin) {
      const hashedPassword = await hashPassword('admin123')

      await prisma.user.create({
        data: {
          email: 'admin@example.com',
          user_name: 'admin',
          password: hashedPassword,
          ativo: true,
          telefone: '(11) 99999-9999',
        },
      })

      console.log('✅ Usuário admin padrão criado: admin@example.com / admin123')
    }
  } catch (error) {
    console.error('Erro ao criar usuário admin padrão:', error)
  }
}
