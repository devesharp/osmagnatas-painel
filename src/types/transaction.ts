export type TransactionStatus = 'PENDING' | 'CANCELED' | 'PAYED'
export type PaymentType = 'IN' | 'OUT'

export interface Transaction {
  id: number
  customer_id: number
  inadimplencia_id?: number | null
  status: TransactionStatus
  payment_type: PaymentType
  notes?: string | null
  amount: number
  moeda: string
  expired_at?: Date | null
  payed_at?: Date | null
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
  inadimplencia?: {
    id: number
    amount: number
    amount_payed: number
  } | null
}

export interface CreateTransactionRequest {
  customer_id: number
  inadimplencia_id?: number
  status?: TransactionStatus
  payment_type?: PaymentType
  notes?: string
  amount: number
  moeda?: string
  expired_at?: Date
  payed_at?: Date
  created_by: number
}

export interface UpdateTransactionRequest {
  customer_id?: number
  inadimplencia_id?: number | null
  status?: TransactionStatus
  payment_type?: PaymentType
  notes?: string
  amount?: number
  moeda?: string
  expired_at?: Date | null
  payed_at?: Date | null
}

export interface TransactionsSearchFilters {
  search?: string
  sort?: string
  status?: TransactionStatus
  payment_type?: PaymentType
  customer_id?: number
  moeda?: string
  amount_min?: number
  amount_max?: number
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
