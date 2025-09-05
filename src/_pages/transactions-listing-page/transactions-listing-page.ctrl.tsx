"use client";

import { useRef, useState } from "react";
import { ColumnConfig } from "@/components/table-listing/table-listing.types";
import { ITransactionsListingPageFilters } from "./components/transactions-listing-page-filters/transactions-listing-page-filters.types";
import { useTransactionsListingPageColumns } from "./transactions-listing-page.cols";
import {
  IResolve,
  IResponseResults,
  useViewList,
} from "@devesharp/react-hooks-v2";
import { transactionsApi } from "@/api/transactions.request";
import { Transaction } from "@/types/transaction";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Usar o tipo Transaction como item da listagem
type TransactionsListingPageItem = Transaction;

// Implementar a API de busca usando a API de transactions
const transactionsListingPageApi = {
  search: async (filters: ITransactionsListingPageFilters) => {
    try {
      const response = await transactionsApi.search(filters);
      return {
        count: response.total,
        results: response.results,
      };
    } catch (error) {
      console.error("Erro ao buscar transactions:", error);
      return {
        count: 0,
        results: [],
      };
    }
  },
};

export function TransactionsListingPageCtrl() {
  const router = useRouter();
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const viewList = useViewList<TransactionsListingPageItem, ITransactionsListingPageFilters>({
    resolveResources: transactionsListingPageApi.search as IResolve<
      IResponseResults<TransactionsListingPageItem>
    >,
    onAfterSearch: () => {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    },
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Handlers para as ações
  const handleEdit = (item: TransactionsListingPageItem) => {
    router.push(`/transactions/${item.id}`);
  };

  const handleView = (item: TransactionsListingPageItem) => {
    router.push(`/transactions/view/${item.id}`);
  };

  const handleDelete = async (item: TransactionsListingPageItem) => {
    if (confirm(`Tem certeza que deseja excluir a transação #${item.id}?`)) {
      try {
        setDeleteLoading(item.id);
        await transactionsApi.delete(item.id);
        toast.success("Transação excluída com sucesso!");
        viewList.reload();
      } catch (error) {
        console.error("Erro ao excluir transação:", error);
        toast.error("Erro ao excluir transação");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  // Configuração das colunas
  const columns: ColumnConfig<TransactionsListingPageItem>[] = useTransactionsListingPageColumns({
    onEdit: handleEdit,
    onView: handleView,
    onDelete: handleDelete,
  });

  // Handler para ações em lote
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;

    if (confirm(`Tem certeza que deseja excluir ${selectedItems.length} transações?`)) {
      try {
        for (const id of selectedItems) {
          await transactionsApi.delete(id);
        }
        toast.success(`${selectedItems.length} transações excluídas com sucesso!`);
        setSelectedItems([]);
        viewList.reload();
      } catch (error) {
        console.error("Erro ao excluir transações:", error);
        toast.error("Erro ao excluir transações");
      }
    }
  };

  // Ações em lote
  const actions = [
    {
      icon: <span>📝</span>,
      title: "Editar Selecionados",
      onClick: () => {
        if (selectedItems.length === 0) {
          toast.warning("Selecione pelo menos uma transação para editar");
          return;
        }
        toast.info("Funcionalidade de edição em lote em desenvolvimento");
      },
      disabled: selectedItems.length === 0,
    },
    {
      icon: <span>🗑️</span>,
      title: "Excluir Selecionados",
      onClick: handleBulkDelete,
      disabled: selectedItems.length === 0,
    },
  ];

  return {
    containerRef,
    viewList,
    columns,
    openFilterModal,
    setOpenFilterModal,
    selectedItems,
    setSelectedItems,
    actions,
    deleteLoading,
  };
} 