// Tipos para a página Transactions Form Page

import { Transaction, CreateTransactionRequest, UpdateTransactionRequest, TransactionStatus, PaymentType } from "@/types/transaction";

export interface TransactionsFormPageProps {
  id?: string; // ID da transação para edição
}

// Interface para os dados do formulário
export interface ITransactionsFormPageForm {
  id?: number;
  customer_id: number;
  status: TransactionStatus;
  payment_type: PaymentType;
  notes?: string;
  amount: number;
  moeda: string;
  expired_at?: Date;
  payed_at?: Date;
}

// Tipo para a resposta da API
export type TransactionsFormItem = Transaction; 