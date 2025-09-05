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
import { Transaction, TransactionStatus, PaymentType } from "@/types/transaction";

// Importar o tipo correto do item
type TransactionsListingPageItem = Transaction;

// Componente para coluna de ações
interface ActionsColProps {
  item: TransactionsListingPageItem;
  onEdit?: (item: TransactionsListingPageItem) => void;
  onView?: (item: TransactionsListingPageItem) => void;
  onDelete?: (item: TransactionsListingPageItem) => void;
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
interface UseTransactionsListingPageColumnsProps {
  onEdit?: (item: TransactionsListingPageItem) => void;
  onView?: (item: TransactionsListingPageItem) => void;
  onDelete?: (item: TransactionsListingPageItem) => void;
}

// Componente para coluna de status
function StatusCol({ status }: { status: TransactionStatus }) {
  const statusConfig = {
    PENDING: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    CANCELED: { label: 'Cancelado', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    PAYED: { label: 'Pago', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
}

// Componente para coluna de valor
function AmountCol({ amount, moeda }: { amount: number; moeda: string }) {
  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: moeda || 'BRL',
  }).format(amount);

  return <span className="font-mono">{formattedAmount}</span>;
}

// Componente para coluna de tipo de pagamento
function PaymentTypeCol({ paymentType }: { paymentType: PaymentType }) {
  const config = {
    IN: { label: 'Entrada', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    OUT: { label: 'Saída', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
  };

  const paymentConfig = config[paymentType];

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentConfig?.className}`}>
      {paymentConfig?.label}
    </span>
  );
}

// Componente para coluna de data
function DateCol({ date }: { date?: Date | null }) {
  if (!date) return <span className="text-muted-foreground">-</span>;

  return (
    <span className="text-sm">
      {new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })}
    </span>
  );
}

export function useTransactionsListingPageColumns({
  onEdit,
  onView,
  onDelete,
}: UseTransactionsListingPageColumnsProps = {}) {
  const columns: ColumnConfig<TransactionsListingPageItem>[] = useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        width: "80px",
        sortable: true,
        render: (item) => <span className="font-semibold">{item.id}</span>,
      },
      {
        key: "customer",
        title: "Cliente",
        width: "200px",
        sortable: true,
        render: (item) => (
          <span className="text-sm">
            {item.customer?.name || `Cliente #${item.customer_id}`}
          </span>
        ),
      },
      {
        key: "status",
        title: "Status",
        width: "120px",
        sortable: true,
        render: (item) => <StatusCol status={item.status} />,
      },
      {
        key: "payment_type",
        title: "Tipo",
        width: "100px",
        sortable: true,
        render: (item) => <PaymentTypeCol paymentType={item.payment_type} />,
      },
      {
        key: "amount",
        title: "Valor",
        width: "120px",
        sortable: true,
        render: (item) => <AmountCol amount={item.amount} moeda={item.moeda} />,
      },
      {
        key: "moeda",
        title: "Moeda",
        width: "80px",
        sortable: true,
        render: (item) => <span className="text-sm">{item.moeda}</span>,
      },
      {
        key: "expired_at",
        title: "Vencimento",
        width: "120px",
        sortable: true,
        render: (item) => <DateCol date={item.expired_at} />,
      },
      {
        key: "payed_at",
        title: "Pagamento",
        width: "120px",
        sortable: true,
        render: (item) => <DateCol date={item.payed_at} />,
      },
      {
        key: "createdAt",
        title: "Criação",
        width: "120px",
        sortable: true,
        render: (item) => <DateCol date={item.createdAt} />,
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
            onDelete={onDelete}
          />
        ),
      },
    ],
    [onEdit, onView, onDelete]
  );

  return columns;
} 