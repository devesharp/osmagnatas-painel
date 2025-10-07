"use client";

import { useRef, useState } from "react";
import { ColumnConfig } from "@/components/table-listing/table-listing.types";
import { IInadimplenciaListingPageFilters } from "./components/inadimplencia-listing-page-filters/inadimplencia-listing-page-filters.types";
import { useInadimplenciaListingPageColumns } from "./inadimplencia-listing-page.cols";
import { InadimplenciaListingPageItem } from "./inadimplencia-listing-page.types";
import { inadimplenciaApi } from "@/api/inadimplencia.request";
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
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    inadimplencia: InadimplenciaListingPageItem | null;
  }>({
    open: false,
    inadimplencia: null,
  });
  
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
    window.location.href = `/inadimplencia/${item.id}/edit`;
  };

  const handleDelete = async (item: InadimplenciaListingPageItem) => {
    console.log("Excluir item:", item.id);
    try {
      await inadimplenciaApi.delete(item.id);
      viewList.reloadPage(); // Recarregar a lista após exclusão
    } catch (error) {
      console.error("Erro ao excluir inadimplência:", error);
    }
  };

  const handlePay = (item: InadimplenciaListingPageItem) => {
    setPaymentModal({
      open: true,
      inadimplencia: item,
    });
  };

  const handleConfirmPayment = async (amount: number, notes: string) => {
    if (!paymentModal.inadimplencia) return;

    try {
      await inadimplenciaApi.payment(paymentModal.inadimplencia.id, {
        amount,
        notes,
        moeda: "USD",
      });

      // Recarregar a lista
      viewList.reloadPage();
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      throw error;
    }
  };

  const handleClosePaymentModal = () => {
    setPaymentModal({
      open: false,
      inadimplencia: null,
    });
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
    paymentModal,
    handleConfirmPayment,
    handleClosePaymentModal,
  };
} 