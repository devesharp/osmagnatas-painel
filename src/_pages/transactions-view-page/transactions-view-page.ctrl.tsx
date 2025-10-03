"use client";

import { useViewForm } from "@devesharp/react-hooks-v2";
import { useParams, useRouter } from "next/navigation";
import { TransactionsViewItem } from "./transactions-view-page.types";
import { transactionsApi } from "@/api/transactions.request";

// API para visualização de transactions
const transactionsViewApi = {
  getById: async (id: number): Promise<TransactionsViewItem> => {
    return await transactionsApi.getById(id);
  },
};

export function TransactionsViewPageCtrl() {
  const { id } = useParams();
  const router = useRouter();

  const viewResource = useViewForm<TransactionsViewItem>({
    id: id as string,
    resolveGet: (id) => transactionsViewApi.getById(Number(id)),
  });

  const handleEdit = () => {
    router.push(`/transactions/${id}/edit`);
  };

  const handleBack = () => {
    router.push('/transactions');
  };

  // Função auxiliar para formatar status
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "Pendente",
      CANCELED: "Cancelado",
      PAYED: "Pago",
    };
    return statusMap[status] || status;
  };

  // Função auxiliar para formatar tipo de pagamento
  const getPaymentTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      IN: "Entrada (Recebimento)",
      OUT: "Saída (Pagamento)",
    };
    return typeMap[type] || type;
  };

  // Função auxiliar para formatar moeda
  const getCurrencyLabel = (currency: string) => {
    const currencyMap: Record<string, string> = {
      BRL: "Real (BRL)",
      USD: "Dólar Americano (USD)",
      EUR: "Euro (EUR)",
    };
    return currencyMap[currency] || currency;
  };

  // Função auxiliar para formatar data
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Função auxiliar para formatar valor
  const formatAmount = (amount: number, currency: string = "BRL") => {
    // Para USD, usar formatação em inglês
    const locale = currency === "USD" ? "en-US" : "pt-BR";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return {
    viewResource,
    transaction: viewResource.resource,
    handleEdit,
    handleBack,
    getStatusLabel,
    getPaymentTypeLabel,
    getCurrencyLabel,
    formatDate,
    formatAmount,
  };
}

