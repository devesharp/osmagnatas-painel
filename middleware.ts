import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './src/lib/auth'

// Rotas que não precisam de autenticação
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/',
  '/login',
  '/_next',
  '/favicon.png',
  '/api/health'
]

// Função para verificar se a rota é pública
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route)
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se é uma rota da API que precisa de autenticação
  if (pathname.startsWith('/api/') && !isPublicRoute(pathname)) {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
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

    const token = authHeader.substring(7) // Remove "Bearer " prefix
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

    // Adicionar informações do usuário ao header para uso nas rotas
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', decoded.userId.toString())
    requestHeaders.set('x-user-email', decoded.email)
    requestHeaders.set('x-user-admin', decoded.is_admin.toString())
    requestHeaders.set('x-user-master', decoded.is_master.toString())

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (rotas de autenticação)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.png (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.png|.*\\..*).*)',
  ],
}
