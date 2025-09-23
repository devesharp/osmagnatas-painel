"use client";

import { useRef, useState } from "react";
import { ColumnConfig } from "@/components/table-listing/table-listing.types";
import { IInadimplenciaListingPageFilters } from "./components/inadimplencia-listing-page-filters/inadimplencia-listing-page-filters.types";
import { useInadimplenciaListingPageColumns } from "./inadimplencia-listing-page.cols";
import { InadimplenciaListingPageItem } from "./inadimplencia-listing-page.types";
import { inadimplenciaApi } from "@/api/inadimplencia.request";
import { transactionsApi } from "@/api/transactions.request";
import {
  IResolve,
  IResponseResults,
  useViewList,
} from "@devesharp/react-hooks-v2";

// API para busca de inadimplências (apenas não pagas)
const inadimplenciaListingPageApi = {
  search: async (filters: IInadimplenciaListingPageFilters) => {
    // Sempre filtrar para mostrar apenas inadimplências não pagas
    const searchFilters = { ...filters, payed: false };
    return await inadimplenciaApi.search(searchFilters);
  },
};

export function InadimplenciaListingPageCtrl() {
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  const viewList = useViewList<InadimplenciaListingPageItem, IInadimplenciaListingPageFilters>({
    resolveResources: inadimplenciaListingPageApi.search as IResolve<
      IResponseResults<InadimplenciaListingPageItem>
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
  const handleEdit = (item: InadimplenciaListingPageItem) => {
    console.log("Editar item:", item.id);
    // TODO: Implementar navegação para edição
  };

  const handleDelete = async (item: InadimplenciaListingPageItem) => {
    console.log("Excluir item:", item.id);
    try {
      await inadimplenciaApi.delete(item.id);
      viewList.reload(); // Recarregar a lista após exclusão
    } catch (error) {
      console.error("Erro ao excluir inadimplência:", error);
    }
  };

  const handlePay = async (item: InadimplenciaListingPageItem) => {
    console.log("Pagar inadimplência:", item.id);
    try {
      // 1. Primeiro marcar a inadimplência como paga
      await inadimplenciaApi.update(item.id, { payed: true });

      // 2. Criar transação de pagamento
      const transactionData = {
        customer_id: item.customer_id,
        amount: item.amount,
        status: 'PAYED' as const,
        payment_type: 'IN' as const,
        payed_at: new Date(),
        created_by: 1, // TODO: Pegar do contexto de usuário
      };

      await transactionsApi.create(transactionData);

      // 3. Recarregar a lista (a inadimplência paga não aparecerá mais)
      viewList.reload();
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
    }
  };

  // Configuração das colunas
  const columns: ColumnConfig<InadimplenciaListingPageItem>[] = useInadimplenciaListingPageColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onPay: handlePay,
  });

  // Ações em lote
  const actions = [
    {
      icon: <span>💳</span>,
      title: "Pagar Selecionados",
      onClick: async () => {
        console.log(`Pagando ${selectedItems.length} inadimplências`);
        // TODO: Implementar pagamento em lote
      },
    },
    {
      icon: <span>📝</span>,
      title: "Editar Selecionados",
      onClick: () => {
        console.log(`Editando ${selectedItems.length} itens`);
        // TODO: Implementar edição em lote
      },
    },
    {
      icon: <span>🗑️</span>,
      title: "Excluir Selecionados",
      onClick: async () => {
        console.log(`Excluindo ${selectedItems.length} itens`);
        // TODO: Implementar exclusão em lote
      },
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
  };
} 