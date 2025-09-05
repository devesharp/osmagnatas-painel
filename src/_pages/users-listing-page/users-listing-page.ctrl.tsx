"use client";

import { useRef, useState } from "react";
import { ColumnConfig } from "@/components/table-listing/table-listing.types";
import { IUsersListingPageFilters } from "./components/users-listing-page-filters/users-listing-page-filters.types";
import { useUsersListingPageColumns } from "./users-listing-page.cols";
import { UsersListingPageItem } from "./users-listing-page.types";
import { usersApi } from "@/api/users.request";
import {
  IResolve,
  IResponseResults,
  useViewList,
} from "@devesharp/react-hooks-v2";
import { useRouter } from "next/navigation";
import {
  confirmation,
  confirmationDelete,
} from "@/components/confirmation/confirmation.utils";
import { toast } from "sonner";

export function UsersListingPageCtrl() {
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const router = useRouter();

  const viewList = useViewList<UsersListingPageItem, IUsersListingPageFilters>({
    resolveResources: usersApi.search as IResolve<
      IResponseResults<UsersListingPageItem>
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
  const handleEdit = (item: UsersListingPageItem) => {
    router.push(`/users/${item.CODIGO}/edit`);
  };

  const handleActivate = async (item: UsersListingPageItem) => {
    try {
      usersApi.update(item.CODIGO, { ATIVO: 1 });
      viewList.reloadPage();
      toast.success("Usuário ativado com sucesso");
    } catch (error) {
      toast.error("Erro ao ativar usuário: " + error);
    }
  };

  const handleDeactivate = async (item: UsersListingPageItem) => {
    try {
      usersApi.update(item.CODIGO, { ATIVO: 0 });
      viewList.reloadPage();
      toast.success("Usuário desativado com sucesso");
    } catch (error) {
      toast.error("Erro ao desativar usuário: " + error);
    }
  };

  // Configuração das colunas
  const columns: ColumnConfig<UsersListingPageItem>[] =
    useUsersListingPageColumns({
      onEdit: handleEdit,
      onActivate: handleActivate,
      onDeactivate: handleDeactivate,
    });

  // Função wrapper para lidar com a seleção
  const handleSelectedChange = (selectedIds: (string | number)[]) => {
    const numberIds = selectedIds.map((id) =>
      typeof id === "string" ? parseInt(id) : id
    );
    setSelectedItems(numberIds);
  };

  // Ações em lote
  const actions = [
    {
      icon: <span>✏️</span>,
      title: "Editar Selecionados",
      onClick: () => {
        console.log(`Editando ${selectedItems.length} usuários`);
      },
    },
    {
      icon: <span>🗑️</span>,
      title: "Excluir Selecionados",
      onClick: () => {
        console.log(`Excluindo ${selectedItems.length} usuários`);
      },
    },
    {
      icon: <span>🔒</span>,
      title: "Desativar Selecionados",
      onClick: () => {
        console.log(`Desativando ${selectedItems.length} usuários`);
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
    handleSelectedChange,
    actions,
  };
}
