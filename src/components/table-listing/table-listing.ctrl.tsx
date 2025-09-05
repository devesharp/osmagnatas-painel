import { useState, useMemo, useCallback } from "react";
import {
  TableListingProps,
  SortState,
  ColumnConfig,
} from "./table-listing.types";

export function useTableListingCtrl<T = Record<string, unknown>>(
  props: TableListingProps<T>
) {
  const {
    items,
    columns,
    defaultSort,
    sortState: externalSortState,
    onSortChange,
    loading = false,
    loadingMessage = "Carregando...",
    onRowClick,
    getRowKey,
    striped = false,
    horizontalScrollOnMobile = false,
    withSelect = false,
    selecteds = [],
    onSelected,
    getItemId,
  } = props;

  // Estado interno de ordenação (usado quando não há controle externo)
  const [internalSortState, setInternalSortState] = useState<SortState | null>(
    defaultSort || null
  );

  // Usa o estado externo se fornecido, senão usa o interno
  const currentSortState = externalSortState || internalSortState;

  // Função para obter o ID de um item
  const getItemIdValue = useCallback(
    (item: T) => {
      if (getItemId) {
        return getItemId(item);
      }

      // Tenta usar um campo 'id' se existir
      const itemWithId = item as Record<string, unknown>;
      if (itemWithId.id) {
        return String(itemWithId.id);
      }

      // Fallback para usar a função getRowKey se disponível
      if (getRowKey) {
        return getRowKey(item, 0);
      }

      throw new Error("getItemId é obrigatório quando withSelect é true");
    },
    [getItemId, getRowKey]
  );

  // Função para alternar seleção de um item
  const handleItemSelect = useCallback(
    (item: T) => {
      if (!withSelect || !onSelected) return;

      const itemId = getItemIdValue(item);
      const isSelected = selecteds.includes(itemId);

      let newSelected: (string | number)[];
      if (isSelected) {
        newSelected = selecteds.filter((id) => id !== itemId);
      } else {
        newSelected = [...selecteds, itemId];
      }

      onSelected(newSelected);
    },
    [withSelect, onSelected, selecteds, getItemIdValue]
  );

  // Função para selecionar/deselecionar todos os itens
  const handleSelectAll = useCallback(() => {
    if (!withSelect || !onSelected) return;

    const allItemIds = items.map((item) => getItemIdValue(item));
    const allSelected = allItemIds.every((id) => selecteds.includes(id));

    if (allSelected) {
      // Deselecionar todos
      onSelected([]);
    } else {
      // Selecionar todos
      onSelected(allItemIds);
    }
  }, [withSelect, onSelected, items, selecteds, getItemIdValue]);

  // Verifica se um item está selecionado
  const isItemSelected = useCallback(
    (item: T) => {
      if (!withSelect) return false;
      const itemId = getItemIdValue(item);
      return selecteds.includes(itemId);
    },
    [withSelect, selecteds, getItemIdValue]
  );

  // Verifica se todos os itens estão selecionados
  const isAllSelected = useMemo(() => {
    if (!withSelect || items.length === 0) return false;
    const allItemIds = items.map((item) => getItemIdValue(item));
    return allItemIds.every((id) => selecteds.includes(id));
  }, [withSelect, items, selecteds, getItemIdValue]);

  // Verifica se alguns itens estão selecionados (para estado indeterminado)
  const isSomeSelected = useMemo(() => {
    if (!withSelect || items.length === 0) return false;
    const allItemIds = items.map((item) => getItemIdValue(item));
    const selectedCount = allItemIds.filter((id) =>
      selecteds.includes(id)
    ).length;
    return selectedCount > 0 && selectedCount < allItemIds.length;
  }, [withSelect, items, selecteds, getItemIdValue]);

  // Função para alternar a ordenação de uma coluna
  const handleSort = useCallback(
    (columnKey: string) => {
      const newSortState: SortState = {
        column: columnKey,
        direction:
          currentSortState?.column === columnKey
            ? currentSortState?.direction === "asc"
              ? "desc"
              : currentSortState?.direction === "desc"
              ? null
              : "asc"
            : "asc",
      };

      // Se não há controle externo, atualiza o estado interno
      if (!externalSortState) {
        setInternalSortState(newSortState);
      }

      // Chama o callback se fornecido
      onSortChange?.(newSortState);
    },
    [currentSortState, externalSortState, onSortChange]
  );

  // Função para obter o valor de ordenação de um item
  const getSortValue = useCallback((item: T, column: ColumnConfig<T>) => {
    if (column.sortValue) {
      return column.sortValue(item);
    }

    // Se não há função customizada, tenta acessar a propriedade pelo key
    const value = (item as Record<string, unknown>)[column.key];

    // Converte para string se não for um tipo ordenável
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      value instanceof Date
    ) {
      return value;
    }

    return String(value || "");
  }, []);

  // Itens ordenados
  const sortedItems = useMemo(() => {
    if (!currentSortState?.column || !currentSortState?.direction) {
      return items;
    }

    const column = columns.find((col) => col.key === currentSortState?.column);
    if (!column || !column.sortable) {
      return items;
    }

    return [...items].sort((a, b) => {
      const aValue = getSortValue(a, column);
      const bValue = getSortValue(b, column);

      let comparison = 0;

      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }

      return currentSortState.direction === "desc" ? -comparison : comparison;
    });
  }, [items, currentSortState, columns, getSortValue]);

  // Função para gerar key da linha
  const generateRowKey = useCallback(
    (item: T, index: number) => {
      if (getRowKey) {
        return getRowKey(item, index);
      }

      // Tenta usar um campo 'id' se existir
      const itemWithId = item as Record<string, unknown>;
      if (itemWithId.id) {
        return String(itemWithId.id);
      }

      // Fallback para o índice
      return `row-${index}`;
    },
    [getRowKey]
  );

  // Função para lidar com clique na linha
  const handleRowClick = useCallback(
    (item: T, index: number) => {
      onRowClick?.(item, index);
    },
    [onRowClick]
  );

  // Função para obter o ícone de ordenação
  const getSortIcon = useCallback(
    (columnKey: string): "asc" | "desc" | null => {
      if (currentSortState?.column === columnKey) {
        return currentSortState?.direction;
      }
      return null;
    },
    [currentSortState]
  );

  // Função para renderizar o conteúdo da célula
  const renderCellContent = useCallback(
    (item: T, column: ColumnConfig<T>, index: number) => {
      if (column.render) {
        return column.render(item, index);
      }

      // Renderização padrão: acessa a propriedade pelo key
      const value = (item as Record<string, unknown>)[column.key];
      return String(value || "");
    },
    []
  );

  // Verifica se deve mostrar estado vazio
  const isEmpty = !loading && sortedItems.length === 0;

  // Verifica se alguma coluna é sortable
  const hasSortableColumns = columns.some((col) => col.sortable);

  return {
    // Estados
    sortedItems,
    currentSortState,
    isEmpty,
    loading,
    hasSortableColumns,

    // Estados de seleção
    withSelect,
    selecteds,
    isAllSelected,
    isSomeSelected,

    // Mensagens
    loadingMessage,

    // Configurações
    striped,
    horizontalScrollOnMobile,

    // Funções
    handleSort,
    handleRowClick,
    generateRowKey,
    getSortIcon,
    renderCellContent,

    // Funções de seleção
    handleItemSelect,
    handleSelectAll,
    isItemSelected,
  };
}
