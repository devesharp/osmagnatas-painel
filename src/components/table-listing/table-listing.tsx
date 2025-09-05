"use client";

import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { ChevronUp, ChevronDown } from "lucide-react";
import { IoSearch } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";
import { TableListingProps, ColumnConfig } from "./table-listing.types";
import { useTableListingCtrl } from "./table-listing.ctrl";
import _ from "lodash";

// Componente otimizado para linha da tabela
interface TableRowItemProps<T> {
  item: T;
  index: number;
  rowKey: string;
  columns: ColumnConfig<T>[];
  withSelect: boolean;
  onRowClick?: (item: T, index: number) => void;
  isItemSelected: (item: T) => boolean;
  handleItemSelect: (item: T) => void;
  renderCellContent: (
    item: T,
    column: ColumnConfig<T>,
    index: number
  ) => React.ReactNode;
}

const TableRowItem = React.memo(
  function TableRowItem<T>({
    item,
    index,
    rowKey,
    columns,
    withSelect,
    onRowClick,
    isItemSelected,
    handleItemSelect,
    renderCellContent,
  }: TableRowItemProps<T>) {
    // console.log(rowKey);
    
    return (
      <Tr
        className={cn(
          "border-b transition-colors",
          "hover:bg-muted/50",
          onRowClick && "cursor-pointer",
          "data-[state=selected]:bg-muted",
          // Animação de entrada suave
          // "animate-in fade-in duration-150"
        )}
        onClick={() => onRowClick?.(item, index)}
      >
        {withSelect && (
          <Td className="p-2 align-middle w-12">
            <div
              className="flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={isItemSelected(item)}
                onCheckedChange={() => handleItemSelect(item)}
              />
            </div>
          </Td>
        )}
        {columns.map((column) => (
          <Td
            key={`${rowKey}-${column.key}`}
            className={cn(
              "p-2 align-middle",
              column.className,
              column.hideOnMobile && "hidden sm:table-cell",
              column.onColClick && "cursor-pointer"
            )}
            onClick={(e) => {
              column.onColClick?.(item, index);
            }}
          >
            {renderCellContent(item, column, index)}
          </Td>
        ))}
      </Tr>
    );
  },
  (prevProps, nextProps) => {

    return false;
    // Comparação customizada para evitar re-renders desnecessários
    return (
      prevProps.rowKey === nextProps.rowKey &&
      _.isEqual(prevProps.item, nextProps.item) &&
      prevProps.index === nextProps.index
      // prevProps.withSelect === nextProps.withSelect &&
      // prevProps.columns === nextProps.columns
      // prevProps.onRowClick === nextProps.onRowClick &&
      // prevProps.isItemSelected === nextProps.isItemSelected &&
      // prevProps.handleItemSelect === nextProps.handleItemSelect &&
      // prevProps.renderCellContent === nextProps.renderCellContent
    );
  }
) as <T>(props: TableRowItemProps<T>) => React.JSX.Element;

export function TableListing<T = Record<string, unknown>>(
  props: TableListingProps<T>
) {
  const { className, containerClassName, columns } = props;

  const ctrl = useTableListingCtrl(props);

  // Memoizar as props estáveis para evitar re-renders desnecessários
  const stableProps = React.useMemo(
    () => ({
      columns,
      withSelect: ctrl.withSelect,
      onRowClick: props.onRowClick,
      isItemSelected: ctrl.isItemSelected,
      handleItemSelect: ctrl.handleItemSelect,
      renderCellContent: ctrl.renderCellContent,
    }),
    [
      columns,
      ctrl.withSelect,
      props.onRowClick,
      ctrl.isItemSelected,
      ctrl.handleItemSelect,
      ctrl.renderCellContent,
    ]
  );

  // Renderiza o ícone de ordenação
  const renderSortIcon = (columnKey: string) => {
    const sortDirection = ctrl.getSortIcon(columnKey);

    if (sortDirection === "asc") {
      return <ChevronUp className="ml-1 h-4 w-4" />;
    }

    if (sortDirection === "desc") {
      return <ChevronDown className="ml-1 h-4 w-4" />;
    }

    return null;
  };

  // Renderiza o estado de loading
  if (ctrl.loading && !props.items.length) {
    return (
      <div className={cn("w-full", containerClassName)}>
        <Table
          className={cn(
            "w-full caption-bottom text-sm",
            ctrl.striped && "striped",
            className
          )}
        >
          <Thead>
            <Tr className="border-b sticky">
              {ctrl.withSelect && (
                <Th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap sticky w-12">
                  <div className="flex items-center justify-center">
                    <Checkbox disabled />
                  </div>
                </Th>
              )}
              {columns.map((column) => (
                <Th
                  key={column.key}
                  className={cn(
                    "h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap sticky",
                    column.headerClassName,
                    column.hideOnMobile && "hidden sm:table-cell"
                  )}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center text-[13px] font-semibold">
                    {column.title}
                  </div>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {Array.from({ length: 20 }).map((_, index) => (
              <Tr
                key={`skeleton-${index}`}
                className="border-b transition-colors animate-pulse"
              >
                {ctrl.withSelect && (
                  <Td className="p-2 align-middle w-12">
                    <div className="flex items-center justify-center">
                      <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                    </div>
                  </Td>
                )}
                {columns.map((column) => (
                  <Td
                    key={`skeleton-${index}-${column.key}`}
                    className={cn(
                      "p-2 align-middle",
                      column.className,
                      column.hideOnMobile && "hidden sm:table-cell"
                    )}
                  >
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    );
  }

  // Renderiza o estado vazio
  if (ctrl.isEmpty) {
    return (
      <div className={cn("w-full", containerClassName)}>
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="relative mb-6">
            <div className="relative bg-gradient-to-r">
              <IoSearch className="h-12 w-12 text-blue-500" />
            </div>
          </div>

          <div className="text-center max-w-md">
            <h3 className="text-lg font-semibold mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Não há foi encontrado nenhum resultado para a busca com os filtros
              atuais, tente ajustar os filtros.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full relative", containerClassName)}>
      {ctrl.loading && (
        <div className="absolute w-full h-full bg-background/80 top-0 left-0 z-10 animate-in fade-in duration-50" />
      )}
      <Table
        className={cn(
          "w-full caption-bottom text-sm",
          ctrl.striped && "striped",
          className
        )}
      >
        <Thead>
          <Tr className="border-b sticky">
            {ctrl.withSelect && (
              <Th className="h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap sticky w-12">
                <div className="flex items-center justify-center">
                  <CheckboxPrimitive.Root
                    checked={
                      ctrl.isAllSelected
                        ? true
                        : ctrl.isSomeSelected
                        ? "indeterminate"
                        : false
                    }
                    onCheckedChange={ctrl.handleSelectAll}
                    className={cn(
                      "peer border-input-dark bg-white data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input",
                      "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=indeterminate]:border-primary"
                    )}
                  >
                    <CheckboxPrimitive.Indicator className="flex items-center justify-center transition-none text-current">
                      {ctrl.isSomeSelected ? (
                        <MinusIcon className="size-3.5" />
                      ) : (
                        <CheckIcon className="size-3.5" />
                      )}
                    </CheckboxPrimitive.Indicator>
                  </CheckboxPrimitive.Root>
                </div>
              </Th>
            )}
            {columns.map((column) => (
              <Th
                key={column.key}
                className={cn(
                  "h-10 px-2 text-left align-middle font-medium text-foreground whitespace-nowrap sticky",
                  column.sortable &&
                    "cursor-pointer select-none hover:bg-muted/50",
                  column.headerClassName,
                  column.hideOnMobile && "hidden sm:table-cell"
                )}
                style={{ width: column.width }}
                onClick={
                  column.sortable
                    ? () => ctrl.handleSort(column.key)
                    : undefined
                }
              >
                <div className="flex items-center text-[13px] font-semibold">
                  {column.title}
                  {column.sortable && renderSortIcon(column.key)}
                </div>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {props.items.map((item, index) => {
            const rowKey = ctrl.generateRowKey(item, index);
            return (
              <TableRowItem
                key={rowKey}
                item={item}
                index={index}
                rowKey={rowKey}
                columns={stableProps.columns}
                withSelect={stableProps.withSelect}
                onRowClick={stableProps.onRowClick}
                isItemSelected={stableProps.isItemSelected}
                handleItemSelect={stableProps.handleItemSelect}
                renderCellContent={stableProps.renderCellContent}
              />
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
}
