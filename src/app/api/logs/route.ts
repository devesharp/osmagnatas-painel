import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Log, APIResponseSearch, LogFilters } from '@/types/log'
import { verifyToken, getUserById } from '@/lib/auth'

// Função auxiliar para extrair token do header Authorization
function getTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

// Função auxiliar para autenticar usuário
async function authenticateUser(request: NextRequest) {
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

  const decoded = verifyToken(token)
  if (!decoded) {
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Token inválido',
          message: 'Token de autenticação inválido'
        }
      },
      { status: 401 }
    )
  }

  const user = await getUserById(decoded.id)
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Usuário não encontrado',
          message: 'Usuário não encontrado'
        }
      },
      { status: 401 }
    )
  }

  return user
}

// GET /api/logs - Listar logs
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await authenticateUser(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const authenticatedUser = authResult

    // Função auxiliar para converter string de data dd/MM/yyyy ou yyyy-MM-dd para Date
    const parseDate = (dateString: string | null): Date | undefined => {
      if (!dateString) return undefined
      // Aceita tanto formato dd/MM/yyyy quanto yyyy-MM-dd
      if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/')
        return new Date(`${year}-${month}-${day}`)
      }
      return new Date(dateString)
    }

    // Extrair parâmetros de busca
    const searchParams = request.nextUrl.searchParams

    const user_id = searchParams.get('user_id')
    const log_type = searchParams.get('log_type') as any
    const date_from_parsed = parseDate(searchParams.get('date_from'))
    const date_to_parsed = parseDate(searchParams.get('date_to'))
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Construir filtros
    const where: any = {}

    if (user_id && user_id !== '-') {
      where.user_id = parseInt(user_id)
    }

    if (log_type && log_type !== '-') {
      where.log_type = log_type
    }

    if (date_from_parsed || date_to_parsed) {
      where.date = {}
      if (date_from_parsed) {
        where.date.gte = date_from_parsed
      }
      if (date_to_parsed) {
        const endDate = new Date(date_to_parsed)
        endDate.setHours(23, 59, 59, 999)
        where.date.lte = endDate
      }
    }

    // Buscar logs com paginação
    const [logs, total] = await Promise.all([
      prisma.log.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              user_name: true,
              email: true,
            }
          }
        },
        orderBy: {
          date: 'desc'
        },
        take: limit,
        skip: offset,
      }),
      prisma.log.count({
        where,
      }),
    ])

    const response: APIResponseSearch<Log> = {
      results: logs,
      count: logs.length,
      total
    }

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error) {
    console.error('Erro ao buscar logs:', error)
    return NextResponse.json(
      {
        success: false,
        data: {
          error: 'Erro interno do servidor',
          message: 'Não foi possível buscar os logs'
        }
      },
      { status: 500 }
    )
  }
}
