// Tipos para a página Transactions Listing Page

import { Transaction, TransactionsSearchFilters } from "@/types/transaction";

export interface TransactionsListingPageProps {
  // Definir props se necessário
}

// Usar o tipo Transaction como item da página
export type TransactionsListingPageItem = Transaction;

// Filtros específicos da página
export interface TransactionsListingPageFilters extends TransactionsSearchFilters {
  // Adicionar filtros específicos se necessário
} 