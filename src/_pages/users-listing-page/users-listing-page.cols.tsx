"use client";

import { useMemo } from "react";
import { ColumnConfig } from "@/components/table-listing/table-listing.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SlOptionsVertical } from "react-icons/sl";
import { UsersListingPageItem } from "./users-listing-page.types";

// Componente para coluna de status
interface StatusColProps {
  item: UsersListingPageItem;
}

function StatusCol({ item }: StatusColProps) {
  const isActive = item.ATIVO === 1;
  
  return (
    <Badge 
      variant={isActive ? "default" : "destructive"}
      className={isActive ? "bg-green-600 hover:bg-green-700" : ""}
    >
      {isActive ? "Ativo" : "Inativo"}
    </Badge>
  );
}

// Componente para coluna de ações
interface ActionsColProps {
  item: UsersListingPageItem;
  onEdit?: (item: UsersListingPageItem) => void;
  onActivate?: (item: UsersListingPageItem) => void;
  onDeactivate?: (item: UsersListingPageItem) => void;
}

function ActionsCol({ item, onEdit, onActivate, onDeactivate }: ActionsColProps) {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="cursor-pointer text-dark-foreground hover:opacity-50 p-1 rounded-full transition-colors bg-dark w-6 h-6 flex items-center justify-center"
            title="Opções"
          >
            <SlOptionsVertical className="h-3.5 w-3.5 text-dark-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => onEdit?.(item)}
            className="cursor-pointer"
          >
            Editar
          </DropdownMenuItem>
          {item.ATIVO != 1 && <DropdownMenuItem
            onClick={() => onActivate?.(item)}
            className="cursor-pointer"
          >
            Ativar
          </DropdownMenuItem>}
          {item.ATIVO == 1 && <DropdownMenuItem
            onClick={() => onDeactivate?.(item)}
            className="cursor-pointer"
          >
            Desativar
          </DropdownMenuItem>}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Props do hook principal
interface UseUsersListingPageColumnsProps {
  onEdit?: (item: UsersListingPageItem) => void;
  onView?: (item: UsersListingPageItem) => void;
  onActivate?: (item: UsersListingPageItem) => void;
  onDeactivate?: (item: UsersListingPageItem) => void;
}

export function useUsersListingPageColumns({
  onEdit,
  onView,
  onActivate,
  onDeactivate,
}: UseUsersListingPageColumnsProps = {}) {
  const columns: ColumnConfig<UsersListingPageItem>[] = useMemo(
    () => [
      {
        key: "CODIGO",
        title: "Código",
        width: "100px",
        sortable: true,
        render: (item) => <span className="font-semibold">{item.CODIGO}</span>,
      },
      {
        key: "ATIVO",
        title: "Status",
        width: "120px",
        sortable: true,
        render: (item) => <StatusCol item={item} />,
      },
      {
        key: "USER_NAME",
        title: "Nome",
        width: "200px",
        sortable: true,
        render: (item) => (
          <span className="font-medium text-foreground">
            {item.USER_NAME}
          </span>
        ),
      },
      {
        key: "EMAIL",
        title: "Email",
        width: "250px",
        sortable: true,
        render: (item) => (
          <span className="text-muted-foreground">
            {item.EMAIL}
          </span>
        ),
      },
      {
        key: "actions",
        title: "",
        width: "60px",
        render: (item) => (
          <ActionsCol
            item={item}
            onEdit={onEdit}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
          />
        ),
      },
    ],
    [onEdit, onActivate, onDeactivate]
  );

  return columns;
} 