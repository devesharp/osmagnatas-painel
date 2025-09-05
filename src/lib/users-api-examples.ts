// Exemplos de uso das APIs de usuários

import { usersApi } from '@/api/users.request'

// Exemplo 1: Listar todos os usuários
export async function getAllUsers() {
  try {
    const users = await usersApi.all()
    console.log('Todos os usuários:', users)
    return users
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    throw error
  }
}

// Exemplo 2: Buscar usuários com filtros
export async function searchUsers() {
  try {
    const result = await usersApi.search({
      search: 'João', // Buscar por nome ou email
      ativo: true,    // Apenas usuários ativos
      sort: 'name',   // Ordenar por nome
      limit: 10,      // 10 resultados por página
      offset: 0       // Primeira página
    })
    console.log('Usuários encontrados:', result.results)
    console.log('Total de usuários:', result.total)
    return result
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    throw error
  }
}

// Exemplo 3: Buscar usuário por ID
export async function getUserById(id: number) {
  try {
    const user = await usersApi.getById(id)
    console.log('Usuário encontrado:', user)
    return user
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    throw error
  }
}

// Exemplo 4: Criar novo usuário
export async function createUser() {
  try {
    const newUser = await usersApi.create({
      email: 'novo.usuario@example.com',
      name: 'Novo Usuário',
      user_name: 'novo_usuario',
      ativo: true
    })
    console.log('Usuário criado:', newUser)
    return newUser
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    throw error
  }
}

// Exemplo 5: Atualizar usuário
export async function updateUser(id: number) {
  try {
    const updatedUser = await usersApi.update(id, {
      name: 'Nome Atualizado',
      ativo: false
    })
    console.log('Usuário atualizado:', updatedUser)
    return updatedUser
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    throw error
  }
}

// Exemplo 6: Deletar usuário
export async function deleteUser(id: number) {
  try {
    await usersApi.delete(id)
    console.log('Usuário deletado com sucesso')
    return true
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    throw error
  }
}

// Exemplo 7: Alternar status do usuário (ativar/desativar)
export async function toggleUserStatus(id: number) {
  try {
    const user = await usersApi.toggleStatus(id)
    console.log('Status do usuário alterado:', user.ativo ? 'Ativo' : 'Inativo')
    return user
  } catch (error) {
    console.error('Erro ao alterar status do usuário:', error)
    throw error
  }
}

// Exemplos de uso direto das rotas da API (usando fetch diretamente)
/*
import { User } from '@/types/user'

// GET /api/users
export async function fetchUsers() {
  const response = await fetch('/api/users')
  const data: { success: boolean; data: { results: User[]; total: number } } = await response.json()
  return data
}

// POST /api/users
export async function createUserDirect() {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'teste@example.com',
      name: 'Teste',
      ativo: true
    }),
  })
  const data: { success: boolean; data: User } = await response.json()
  return data
}

// GET /api/users/[id]
export async function fetchUserById(id: number) {
  const response = await fetch(`/api/users/${id}`)
  const data: { success: boolean; data: User } = await response.json()
  return data
}

// PUT /api/users/[id]
export async function updateUserDirect(id: number) {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Nome Atualizado',
      ativo: false
    }),
  })
  const data: { success: boolean; data: User } = await response.json()
  return data
}

// DELETE /api/users/[id]
export async function deleteUserDirect(id: number) {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  })
  const data: { success: boolean; data: null } = await response.json()
  return data
}
*/
