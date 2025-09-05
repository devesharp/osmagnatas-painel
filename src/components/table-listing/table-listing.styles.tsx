import { cn } from '@/lib/utils';

// Estilos customizados para a tabela responsiva
export const tableListingStyles = {
  // Container principal
  container: "w-full overflow-hidden rounded-lg border border-border",
  
  // Tabela
  table: cn(
    "w-full caption-bottom text-sm",
    // Customizações para react-super-responsive-table
    "[&_.responsiveTable]:w-full",
    "[&_.responsiveTable]:border-collapse",
    "[&_.responsiveTable]:border-spacing-0"
  ),
  
  // Cabeçalho
  header: cn(
    "bg-muted/50",
    "[&_th]:h-10",
    "[&_th]:px-2", 
    "[&_th]:text-left",
    "[&_th]:align-middle",
    "[&_th]:font-medium",
    "[&_th]:text-foreground",
    "[&_th]:border-b",
    "[&_th]:border-border"
  ),
  
  // Linha do cabeçalho
  headerRow: "border-b border-border",
  
  // Célula do cabeçalho
  headerCell: cn(
    "h-10 px-2 text-left align-middle font-medium text-foreground",
    "border-b border-border whitespace-nowrap"
  ),
  
  // Célula do cabeçalho ordenável
  sortableHeaderCell: cn(
    "cursor-pointer select-none transition-colors",
    "hover:bg-muted/70 active:bg-muted"
  ),
  
  // Corpo da tabela
  body: cn(
    "[&_tr]:border-b",
    "[&_tr]:border-border",
    "[&_tr:last-child]:border-b-0"
  ),
  
  // Linha do corpo
  bodyRow: cn(
    "border-b border-border transition-colors",
    "data-[state=selected]:bg-muted"
  ),
  
  // Linha com hover
  hoverableRow: "hover:bg-muted/50",
  
  // Linha clicável
  clickableRow: "cursor-pointer",
  
  // Célula do corpo
  bodyCell: cn(
    "p-2 align-middle",
    "[&:has([role=checkbox])]:pr-0",
    "[&>[role=checkbox]]:translate-y-[2px]"
  ),
  
  // Estados de loading e vazio
  emptyState: cn(
    "flex items-center justify-center py-8",
    "text-muted-foreground text-center"
  ),
  
  loadingState: cn(
    "flex items-center justify-center py-8",
    "text-center"
  ),
  
  loadingSpinner: cn(
    "animate-spin rounded-full h-8 w-8 border-b-2 border-primary",
    "mx-auto mb-2"
  ),
  
  // Ícones de ordenação
  sortIcon: "ml-1 h-4 w-4",
  sortIconInactive: "ml-1 h-4 w-4 opacity-50",
  
  // Responsividade customizada
  mobileHidden: "hidden sm:table-cell",
  
  // Variações de estilo
  striped: cn(
    "[&_tbody_tr:nth-child(even)]:bg-muted/25",
    "[&_tbody_tr:nth-child(even):hover]:bg-muted/50"
  ),
  
  compact: cn(
    "[&_th]:h-8",
    "[&_th]:px-1",
    "[&_td]:p-1",
    "text-xs"
  ),
  
  bordered: cn(
    "border border-border",
    "[&_th]:border-r",
    "[&_th]:border-border",
    "[&_th:last-child]:border-r-0",
    "[&_td]:border-r",
    "[&_td]:border-border", 
    "[&_td:last-child]:border-r-0"
  )
};

// Função helper para aplicar estilos condicionais
export const getTableStyles = (options: {
  striped?: boolean;
  compact?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
}) => {
  const { striped, compact, bordered, hoverable } = options;
  
  return {
    table: cn(
      tableListingStyles.table,
      striped && tableListingStyles.striped,
      compact && tableListingStyles.compact,
      bordered && tableListingStyles.bordered
    ),
    row: cn(
      tableListingStyles.bodyRow,
      hoverable && tableListingStyles.hoverableRow
    )
  };
}; 