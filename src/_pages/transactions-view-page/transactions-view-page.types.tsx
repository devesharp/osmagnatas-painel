// Tipos para a página Transactions View Page

import { Transaction } from "@/types/transaction";

// Dados adicionais retornados pela API
export interface CustomerData {
  id: number;
  name: string;
  email: string;
}

export interface CreatorData {
  id: number;
  email: string;
  user_name: string;
}

export interface TransactionsViewItem extends Transaction {
  customer: CustomerData;
  creator: CreatorData;
}

export interface TransactionsViewPageProps {
  id: string; // ID da transação para visualização
} 