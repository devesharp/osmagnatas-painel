import { Customer, CustomersSearchFilters } from "@/types/customer";

// Tipos para a página Clientes

export interface CustomersListingPageProps {
  // Definir props se necessário
}

export type CustomersListingPageItem = Customer;

export interface CustomersListingPageFilters extends CustomersSearchFilters {
  // Adicionar filtros específicos da página se necessário
} 