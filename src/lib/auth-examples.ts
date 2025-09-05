// Exemplos de uso das APIs de autenticação

import { authApi } from '@/api/auth.request'

// Exemplo 1: Fazer login
export async function loginExample() {
  try {
    const loginData = {
      login: 'admin@example.com',
      password: 'admin123'
    }

    const response = await authApi.login(loginData)
    console.log('✅ Login realizado com sucesso!')
    console.log('👤 Usuário:', response.user.NOME_CORRETOR)
    console.log('📧 Email:', response.user.EMAIL)
    console.log('🔑 Token:', response.user.access_token.substring(0, 50) + '...')

    // Salvar token no localStorage (exemplo)
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.user.access_token)
    }

    return response
  } catch (error) {
    console.error('❌ Erro no login:', error)
    throw error
  }
}

// Exemplo 2: Obter dados do usuário autenticado
export async function getMeExample() {
  try {
    // Obter token do localStorage (exemplo)
    const token = typeof window !== 'undefined' ?
      localStorage.getItem('auth_token') : null

    if (!token) {
      throw new Error('Token não encontrado. Faça login primeiro.')
    }

    const response = await authApi.me()
    console.log('✅ Dados do usuário obtidos!')
    console.log('👤 Nome:', response.user.NOME_CORRETOR)
    console.log('📧 Email:', response.user.EMAIL)
    console.log('👑 Admin:', response.user.IS_ADMIN ? 'Sim' : 'Não')
    console.log('🎯 Master:', response.user.IS_MASTER ? 'Sim' : 'Não')

    return response
  } catch (error) {
    console.error('❌ Erro ao obter dados do usuário:', error)
    throw error
  }
}

// Exemplo 3: Teste completo - Login + Obter dados
export async function fullAuthTest() {
  try {
    console.log('🚀 Iniciando teste de autenticação completo...')

    // 1. Fazer login
    console.log('1️⃣ Fazendo login...')
    const loginResponse = await loginExample()

    // 2. Obter dados do usuário
    console.log('2️⃣ Obtendo dados do usuário...')
    const meResponse = await getMeExample()

    console.log('🎉 Teste de autenticação concluído com sucesso!')
    return {
      login: loginResponse,
      me: meResponse
    }
  } catch (error) {
    console.error('❌ Erro no teste de autenticação:', error)
    throw error
  }
}

// Exemplos de uso direto das rotas da API (usando fetch diretamente)
/*
import { LoginRequest, AuthResponse } from '@/api/auth.request'

// POST /api/auth/login
export async function loginDirect(login: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login,
      password,
    }),
  })

  const data: { success: boolean; data: AuthResponse } = await response.json()

  if (!data.success) {
    throw new Error(data.data.error || 'Erro no login')
  }

  return data.data
}

// GET /api/auth/me
export async function getMeDirect(token: string) {
  const response = await fetch('/api/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  const data: { success: boolean; data: AuthResponse } = await response.json()

  if (!data.success) {
    throw new Error(data.data.error || 'Erro ao obter dados do usuário')
  }

  return data.data
}

// Exemplo de uso em componente React
export function AuthComponent() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      const loginData = {
        login: 'admin@example.com',
        password: 'admin123'
      }

      const response = await authApi.login(loginData)
      setUser(response.user)

      // Salvar token
      localStorage.setItem('auth_token', response.user.access_token)

      console.log('Login realizado com sucesso!')
    } catch (error) {
      console.error('Erro no login:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGetMe = async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    try {
      const response = await authApi.me()
      setUser(response.user)
    } catch (error) {
      console.error('Erro ao obter dados:', error)
    }
  }

  return (
    <div>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Fazendo login...' : 'Login'}
      </button>
      <button onClick={handleGetMe}>
        Obter Meus Dados
      </button>

      {user && (
        <div>
          <h3>Usuário Logado:</h3>
          <p>Nome: {user.NOME_CORRETOR}</p>
          <p>Email: {user.EMAIL}</p>
          <p>Admin: {user.IS_ADMIN ? 'Sim' : 'Não'}</p>
        </div>
      )}
    </div>
  )
}
*/
