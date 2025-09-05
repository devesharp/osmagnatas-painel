export type PersonType = 'PF' | 'PJ'

export interface Customer {
  id: number
  name: string
  person_type: PersonType
  email: string
  phone?: string | null
  wallet_address?: string | null
  cpf?: string | null
  cnpj?: string | null
  access_website?: string | null
  access_email?: string | null
  access_password?: string | null
  created_by: number
  createdAt: Date
  updatedAt: Date
  creator?: {
    id: number
    email: string
    user_name?: string | null
  }
}

export interface CreateCustomerRequest {
  name: string
  person_type: PersonType
  email: string
  phone?: string
  wallet_address?: string
  cpf?: string
  cnpj?: string
  access_website?: string
  access_email?: string
  access_password?: string
  created_by: number
}

export interface UpdateCustomerRequest {
  name?: string
  person_type?: PersonType
  email?: string
  phone?: string
  wallet_address?: string
  cpf?: string
  cnpj?: string
  access_website?: string
  access_email?: string
  access_password?: string
}

export interface CustomersSearchFilters {
  search?: string
  sort?: string
  person_type?: PersonType
  name?: string
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
