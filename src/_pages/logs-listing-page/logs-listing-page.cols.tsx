"use client";

import { useMemo } from "react";
import { ColumnConfig } from "@/components/table-listing/table-listing.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlOptionsVertical } from "react-icons/sl";

import { LogsListingPageItem } from "./logs-listing-page.types";

// Componente para coluna de ações
interface ActionsColProps {
  item: LogsListingPageItem;
  onEdit?: (item: LogsListingPageItem) => void;
  onView?: (item: LogsListingPageItem) => void;
  onDelete?: (item: LogsListingPageItem) => void;
}

function ActionsCol({ item, onEdit, onView, onDelete }: ActionsColProps) {
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
interface UseLogsListingPageColumnsProps {
  onEdit?: (item: LogsListingPageItem) => void;
  onView?: (item: LogsListingPageItem) => void;
  onDelete?: (item: LogsListingPageItem) => void;
}

// Componente auxiliar para formatação do tipo de log
function LogTypeBadge({ logType }: { logType: string }) {
  const config: Record<string, { label: string; className: string }> = {
    LOGIN: { label: 'Login', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    LOGOUT: { label: 'Logout', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' },
    CREATE_TRANSACTION: { label: 'Criar Transação', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    UPDATE_TRANSACTION: { label: 'Editar Transação', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    DELETE_TRANSACTION: { label: 'Excluir Transação', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    CREATE_CUSTOMER: { label: 'Criar Cliente', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
    UPDATE_CUSTOMER: { label: 'Editar Cliente', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
    DELETE_CUSTOMER: { label: 'Excluir Cliente', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    VIEW_TRANSACTION: { label: 'Visualizar Transação', className: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300' },
    VIEW_CUSTOMER: { label: 'Visualizar Cliente', className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' },
    CREATE_INADIMPLENCIA: { label: 'Criar Inadimplência', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    UPDATE_INADIMPLENCIA: { label: 'Editar Inadimplência', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    DELETE_INADIMPLENCIA: { label: 'Excluir Inadimplência', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    VIEW_INADIMPLENCIA: { label: 'Visualizar Inadimplência', className: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300' },
  };

  const logConfig = config[logType] || { label: logType, className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${logConfig.className}`}>
      {logConfig.label}
    </span>
  );
}

export function useLogsListingPageColumns({
  onEdit,
  onView,
  onDelete,
}: UseLogsListingPageColumnsProps = {}) {
  const columns: ColumnConfig<LogsListingPageItem>[] = useMemo(
    () => [
      // {
      //   key: "id",
      //   title: "ID",
      //   width: "80px",
      //   sortable: true,
      //   render: (item) => <span className="font-semibold">{item.id}</span>,
      // },
      {
        key: "user",
        title: "Usuário",
        sortable: true,
        render: (item) => item.user?.user_name || item.user?.email || 'Usuário não encontrado',
      },
      {
        key: "log_type",
        title: "Tipo de Ação",
        className: "w-[200px]",
        sortable: true,
        render: (item) => <LogTypeBadge logType={item.log_type} />,
      },
      {
        key: "description",
        title: "Descrição",
        sortable: false,
        render: (item) => (
          <div className="max-w-md truncate" title={item.description}>
            {item.description}
          </div>
        ),
      },
      {
        key: "date",
        title: "Data/Hora",
        width: "160px",
        sortable: true,
        render: (item) => {
          const date = new Date(item.date);
          return date.toLocaleString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
        },
      },
    ],
    []
  );

  return columns;
} 