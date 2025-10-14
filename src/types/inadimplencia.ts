export interface Inadimplencia {
  id: number
  customer_id: number
  amount: number
  amount_payed: number
  payed: boolean
  grams?: number | null
  created_by: number
  createdAt: Date
  updatedAt: Date
  customer?: {
    id: number
    name: string
    email?: string | null
  }
  creator?: {
    id: number
    email: string
    user_name?: string | null
  }
}

export interface CreateInadimplenciaRequest {
  customer_id: number
  amount: number
  payed?: boolean
  grams?: number
  created_by: number
}

export interface UpdateInadimplenciaRequest {
  customer_id?: number
  amount?: number
  amount_payed?: number
  payed?: boolean
  grams?: number
}

export interface InadimplenciaSearchFilters {
  search?: string
  sort?: string
  payed?: boolean
  customer_id?: number
  amount_min?: number
  amount_max?: number
  grams_min?: number
  grams_max?: number
  created_at_start?: string
  created_at_end?: string
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
