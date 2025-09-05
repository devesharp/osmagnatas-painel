"use client";

import { useRef, useState } from "react";
import { ColumnConfig } from "@/components/table-listing/table-listing.types";
import { ICustomersListingPageFilters } from "./components/customers-listing-page-filters/customers-listing-page-filters.types";
import { useCustomersListingPageColumns } from "./customers-listing-page.cols";
import {
  IResolve,
  IResponseResults,
  useViewList,
} from "@devesharp/react-hooks-v2";
import { customersApi } from "@/api/customers.request";
import { CustomersListingPageItem } from "./customers-listing-page.types";

export function CustomersListingPageCtrl() {
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const viewList = useViewList<CustomersListingPageItem, ICustomersListingPageFilters>({
    resolveResources: customersApi.search as IResolve<
      IResponseResults<CustomersListingPageItem>
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
  const handleEdit = (item: CustomersListingPageItem) => {
    console.log("Editar item:", item.id);
    // TODO: Implementar navegação para edição
  };

  const handleView = (item: CustomersListingPageItem) => {
    console.log("Visualizar item:", item.id);
    // TODO: Implementar visualização
  };

  const handleDelete = (item: CustomersListingPageItem) => {
    console.log("Excluir item:", item.id);
    // TODO: Implementar exclusão
  };

  // Configuração das colunas
  const columns: ColumnConfig<CustomersListingPageItem>[] = useCustomersListingPageColumns({
    onEdit: handleEdit,
    onView: handleView,
    onDelete: handleDelete,
  });

  // Ações em lote
  const actions = [
    {
      icon: <span>📝</span>,
      title: "Editar Selecionados",
      onClick: () => {
        console.log(`Editando ${selectedItems.length} itens`);
      },
    },
    {
      icon: <span>🗑️</span>,
      title: "Excluir Selecionados",
      onClick: () => {
        console.log(`Excluindo ${selectedItems.length} itens`);
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