export type LogType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'CREATE_TRANSACTION'
  | 'UPDATE_TRANSACTION'
  | 'DELETE_TRANSACTION'
  | 'CREATE_CUSTOMER'
  | 'UPDATE_CUSTOMER'
  | 'DELETE_CUSTOMER'
  | 'VIEW_TRANSACTION'
  | 'VIEW_CUSTOMER'
  | 'CREATE_INADIMPLENCIA'
  | 'UPDATE_INADIMPLENCIA'
  | 'DELETE_INADIMPLENCIA'
  | 'VIEW_INADIMPLENCIA'

export interface Log {
  id: number
  user_id: number
  log_type: LogType
  description: string
  date: Date
  user?: {
    id: number
    user_name?: string | null
    email: string
  }
}

export interface CreateLogRequest {
  user_id: number
  log_type: LogType
  description: string
}

export interface LogFilters {
  user_id?: number
  log_type?: LogType
  date_from?: string
  date_to?: string
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
