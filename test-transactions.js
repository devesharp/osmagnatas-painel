// Script simples para testar as APIs de transactions
// Execute com: node test-transactions.js

const BASE_URL = 'http://localhost:3000'

async function login() {
  console.log('🔐 Fazendo login...')

  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: 'admin@admin.br',
        password: '123456'
      }),
    })

    const data = await response.json()

    if (data.success) {
      console.log('✅ Login realizado com sucesso!')
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

async function testGetTransactions(token) {
  console.log('🚀 Testando GET /api/transactions...')

  try {
    const response = await fetch(`${BASE_URL}/api/transactions?limit=5`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (data.success) {
      console.log('✅ Transactions obtidas com sucesso!')
      console.log('📊 Total:', data.data.total)
      console.log('📝 Quantidade retornada:', data.data.results.length)
      console.log('💰 Primeira transação:', {
        id: data.data.results[0].id,
        customer: data.data.results[0].customer.name,
        amount: data.data.results[0].amount,
        status: data.data.results[0].status,
        moeda: data.data.results[0].moeda
      })
      return data.data.results[0].id
    } else {
      console.log('❌ Erro ao obter transactions:', data.data.message)
      return null
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message)
    return null
  }
}

async function testGetTransactionById(token, id) {
  console.log('🚀 Testando GET /api/transactions/[id]...')

  try {
    const response = await fetch(`${BASE_URL}/api/transactions/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (data.success) {
      console.log('✅ Transaction obtida por ID!')
      console.log('📝 Detalhes:', {
        id: data.data.id,
        customer: data.data.customer.name,
        amount: data.data.amount,
        status: data.data.status,
        moeda: data.data.moeda,
        notes: data.data.notes
      })
      return true
    } else {
      console.log('❌ Erro ao obter transaction:', data.data.message)
      return false
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message)
    return false
  }
}

async function testCreateTransaction(token) {
  console.log('🚀 Testando POST /api/transactions...')

  try {
    const response = await fetch(`${BASE_URL}/api/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: 1, // João Silva
        amount: 500.00,
        moeda: 'USD',
        notes: 'Teste de criação via API',
        status: 'PENDING'
      }),
    })

    const data = await response.json()

    if (data.success) {
      console.log('✅ Transaction criada com sucesso!')
      console.log('📝 Nova transaction:', {
        id: data.data.id,
        customer: data.data.customer.name,
        amount: data.data.amount,
        status: data.data.status
      })
      return data.data.id
    } else {
      console.log('❌ Erro ao criar transaction:', data.data.message)
      return null
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message)
    return null
  }
}

async function testUpdateTransaction(token, id) {
  console.log('🚀 Testando PUT /api/transactions/[id]...')

  try {
    const response = await fetch(`${BASE_URL}/api/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'PAYED',
        notes: 'Transaction atualizada via API de teste',
        payed_at: new Date().toISOString()
      }),
    })

    const data = await response.json()

    if (data.success) {
      console.log('✅ Transaction atualizada com sucesso!')
      console.log('📝 Transaction atualizada:', {
        id: data.data.id,
        status: data.data.status,
        notes: data.data.notes
      })
      return true
    } else {
      console.log('❌ Erro ao atualizar transaction:', data.data.message)
      return false
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message)
    return false
  }
}

async function runTests() {
  console.log('🧪 Iniciando testes das APIs de Transactions...\n')

  // Login
  const token = await login()
  console.log('')

  if (!token) {
    console.log('❌ Teste interrompido - login falhou')
    return
  }

  // Teste 1: Listar transactions
  const firstTransactionId = await testGetTransactions(token)
  console.log('')

  if (firstTransactionId) {
    // Teste 2: Obter transaction por ID
    await testGetTransactionById(token, firstTransactionId)
    console.log('')
  }

  // Teste 3: Criar nova transaction
  const newTransactionId = await testCreateTransaction(token)
  console.log('')

  if (newTransactionId) {
    // Teste 4: Atualizar transaction
    await testUpdateTransaction(token, newTransactionId)
    console.log('')
  }

  console.log('🎉 Testes das APIs de Transactions concluídos!')
}

// Executar testes
runTests().catch(console.error)
