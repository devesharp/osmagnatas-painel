// Script simples para testar as APIs de autenticação
// Execute com: node test-auth.js

const BASE_URL = 'http://localhost:3000'

async function testLogin() {
  console.log('🚀 Testando login...')

  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: 'admin@example.com',
        password: 'admin123'
      }),
    })

    const data = await response.json()

    if (data.success) {
      console.log('✅ Login realizado com sucesso!')
      console.log('👤 Usuário:', data.data.user.NOME_CORRETOR)
      console.log('📧 Email:', data.data.user.EMAIL)
      console.log('🔑 Token:', data.data.user.access_token.substring(0, 50) + '...')

      return data.data.user.access_token
    } else {
      console.log('❌ Erro no login:', data.data.message)
      return null
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message)
    return null
  }
}

async function testGetMe(token) {
  console.log('🚀 Testando /me...')

  try {
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (data.success) {
      console.log('✅ Dados do usuário obtidos!')
      console.log('👤 Nome:', data.data.user.NOME_CORRETOR)
      console.log('📧 Email:', data.data.user.EMAIL)
      console.log('👑 Admin:', data.data.user.IS_ADMIN ? 'Sim' : 'Não')
      return true
    } else {
      console.log('❌ Erro ao obter dados:', data.data.message)
      return false
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message)
    return false
  }
}

async function testProtectedRoute(token) {
  console.log('🚀 Testando rota protegida (/api/users)...')

  try {
    const response = await fetch(`${BASE_URL}/api/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (data.success) {
      console.log('✅ Rota protegida acessada com sucesso!')
      console.log('📊 Total de usuários:', data.data.total)
      return true
    } else {
      console.log('❌ Erro na rota protegida:', data.data.message)
      return false
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message)
    return false
  }
}

async function runTests() {
  console.log('🧪 Iniciando testes das APIs de autenticação...\n')

  // Teste 1: Login
  const token = await testLogin()
  console.log('')

  if (!token) {
    console.log('❌ Teste interrompido - login falhou')
    return
  }

  // Teste 2: Obter dados do usuário
  const meSuccess = await testGetMe(token)
  console.log('')

  if (!meSuccess) {
    console.log('❌ Teste interrompido - /me falhou')
    return
  }

  // Teste 3: Rota protegida
  const protectedSuccess = await testProtectedRoute(token)
  console.log('')

  // Resultado final
  if (meSuccess && protectedSuccess) {
    console.log('🎉 Todos os testes passaram!')
  } else {
    console.log('❌ Alguns testes falharam')
  }
}

// Executar testes
runTests().catch(console.error)
