"use client";

import { useMemo } from "react";
import { ColumnConfig } from "@/components/table-listing/table-listing.types";
import { Button } from "@/components/ui/button";
import { InadimplenciaListingPageItem } from "./inadimplencia-listing-page.types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { transactionsApi } from "@/api/transactions.request";
import { CreateTransactionRequest } from "@/types/transaction";

// Componente para coluna de ações
interface ActionsColProps {
  item: InadimplenciaListingPageItem;
  onEdit?: (item: InadimplenciaListingPageItem) => void;
  onDelete?: (item: InadimplenciaListingPageItem) => void;
  onPay?: (item: InadimplenciaListingPageItem) => void;
}

function ActionsCol({ item, onEdit, onDelete, onPay }: ActionsColProps) {
  const handlePay = async () => {
    if (onPay && item.payed === false) {
      await onPay(item);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant={item.payed ? "secondary" : "default"}
        disabled={item.payed}
        onClick={handlePay}
        className="h-8 px-2 text-xs"
      >
        {item.payed ? "Pago" : "Pagar"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onEdit?.(item)}
        className="h-8 px-2 text-xs"
      >
        Editar
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onDelete?.(item)}
        className="h-8 px-2 text-xs"
      >
        Excluir
      </Button>
    </div>
  );
}


// Componente para coluna de valor
function AmountCol({ item }: { item: InadimplenciaListingPageItem }) {
  return (
    <span className="font-semibold text-green-600">
      ${item.amount.toFixed(2)}
    </span>
  );
}

// Componente para coluna de customer
function CustomerCol({ item }: { item: InadimplenciaListingPageItem }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium">{item.customer?.name || 'N/A'}</span>
      <span className="text-sm text-muted-foreground">
        {item.customer?.email || 'N/A'}
      </span>
    </div>
  );
}

// Componente para coluna de data
function DateCol({ item }: { item: InadimplenciaListingPageItem }) {
  return (
    <div className="text-sm">
      <div>{format(new Date(item.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</div>
      <div className="text-muted-foreground">
        {format(new Date(item.createdAt), 'HH:mm', { locale: ptBR })}
      </div>
    </div>
  );
}

// Props do hook principal
interface UseInadimplenciaListingPageColumnsProps {
  onEdit?: (item: InadimplenciaListingPageItem) => void;
  onDelete?: (item: InadimplenciaListingPageItem) => void;
  onPay?: (item: InadimplenciaListingPageItem) => void;
}

export function useInadimplenciaListingPageColumns({
  onEdit,
  onDelete,
  onPay,
}: UseInadimplenciaListingPageColumnsProps = {}) {
  const columns: ColumnConfig<InadimplenciaListingPageItem>[] = useMemo(
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
        sortable: true,
        render: (item) => <CustomerCol item={item} />,
      },
      {
        key: "amount",
        title: "Valor",
        width: "120px",
        sortable: true,
        render: (item) => <AmountCol item={item} />,
      },
      {
        key: "createdAt",
        title: "Data",
        width: "150px",
        sortable: true,
        render: (item) => <DateCol item={item} />,
      },
      {
        key: "actions",
        title: "",
        width: "200px",
        render: (item) => (
          <ActionsCol
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
            onPay={onPay}
          />
        ),
      },
    ],
    [onEdit, onDelete, onPay]
  );

  return columns;
} 