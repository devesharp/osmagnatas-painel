export interface User {
  id: number
  email: string
  user_name?: string | null
  password?: string | null
  ativo: boolean
  telefone?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserRequest {
  email: string
  user_name?: string
  password?: string
  ativo?: boolean
  telefone?: string
}

export interface UpdateUserRequest {
  email?: string
  user_name?: string
  password?: string
  ativo?: boolean
  telefone?: string
}

export interface UsersSearchFilters {
  search?: string
  sort?: string
  ativo?: boolean
  user_name?: string
  email?: string
  limit?: number
  offset?: number
}

export interface APIResponse<T> {
  success: boolean
  data: T
}

export interface APIResponseSearch<T> {
  results: T[]
  count: number
  total: number
}
