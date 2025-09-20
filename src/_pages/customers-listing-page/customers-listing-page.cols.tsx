"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ColumnConfig } from "@/components/table-listing/table-listing.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlOptionsVertical } from "react-icons/sl";
import { CustomersListingPageItem } from "../customers-listing-page.types";
import { FileText } from "lucide-react";

// Componente para coluna de ações
interface ActionsColProps {
  item: CustomersListingPageItem;
  onEdit?: (item: CustomersListingPageItem) => void;
  onView?: (item: CustomersListingPageItem) => void;
  onResume?: (item: CustomersListingPageItem) => void;
  onDelete?: (item: CustomersListingPageItem) => void;
}

function ActionsCol({ item, onEdit, onView, onResume, onDelete }: ActionsColProps) {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="text-gray-400 hover:text-white p-1 rounded-full transition-colors bg-muted w-6 h-6 flex items-center justify-center hover:bg-gray-600"
            title="Opções"
          >
            <SlOptionsVertical className="h-3 w-3 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => onResume?.(item)}
            className="cursor-pointer"
          >
            <FileText className="h-4 w-4 mr-2" />
            Resumo
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onEdit?.(item)}
            className="cursor-pointer"
          >
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onView?.(item)}
            className="cursor-pointer"
          >
            Visualizar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete?.(item)}
            className="cursor-pointer"
          >
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Props do hook principal
interface UseCustomersListingPageColumnsProps {
  onEdit?: (item: CustomersListingPageItem) => void;
  onView?: (item: CustomersListingPageItem) => void;
  onResume?: (item: CustomersListingPageItem) => void;
  onDelete?: (item: CustomersListingPageItem) => void;
}

export function useCustomersListingPageColumns({
  onEdit,
  onView,
  onResume,
  onDelete,
}: UseCustomersListingPageColumnsProps = {}) {
  const columns: ColumnConfig<CustomersListingPageItem>[] = useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        width: "80px",
        sortable: true,
        render: (item) => <span className="font-semibold">{item.id}</span>,
      },
      {
        key: "name",
        title: "Nome",
        width: "200px",
        sortable: true,
        render: (item) => <span>{item.name}</span>,
      },
      {
        key: "person_type",
        title: "Tipo",
        width: "80px",
        sortable: true,
        render: (item) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.person_type === 'PF'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {item.person_type}
          </span>
        ),
      },
      {
        key: "email",
        title: "Email",
        width: "200px",
        sortable: true,
        render: (item) => <span>{item.email}</span>,
      },
      {
        key: "phone",
        title: "Telefone",
        width: "150px",
        render: (item) => <span>{item.phone || '-'}</span>,
      },
      {
        key: "cpf_cnpj",
        title: "CPF/CNPJ",
        width: "150px",
        render: (item) => <span>{item.cpf || item.cnpj || '-'}</span>,
      },
      {
        key: "createdAt",
        title: "Criado em",
        width: "150px",
        sortable: true,
        render: (item) => (
          <span>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
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
            onView={onView}
            onResume={onResume}
            onDelete={onDelete}
          />
        ),
      },
    ],
    [onEdit, onView, onResume, onDelete]
  );

  return columns;
} 