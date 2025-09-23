import { Inadimplencia } from '@/types/inadimplencia'

// Tipos para a página Inadimplencia Listing Page

export interface InadimplenciaListingPageProps {
  // Definir props se necessário
}

// Usar o tipo Inadimplencia existente
export interface InadimplenciaListingPageItem extends Inadimplencia {}

// Tipos para filtros
export interface InadimplenciaListingPageFilters {
  search?: string
  payed?: boolean
  customer_id?: number
  amount_min?: number
  amount_max?: number
  limit?: number
  offset?: number
} 