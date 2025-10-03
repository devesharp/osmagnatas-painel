// Tipos para a página Transactions View Page

import { Transaction } from "@/types/transaction";

export interface TransactionsViewPageProps {
  id: string; // ID da transação para visualização
}

// Tipo para a resposta da API
export type TransactionsViewItem = Transaction; 