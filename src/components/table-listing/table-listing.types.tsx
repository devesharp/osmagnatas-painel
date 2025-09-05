import { ReactNode } from 'react';

/** Tipo de ordenação da coluna */
export type SortDirection = 'asc' | 'desc' | null;

/** Configuração de uma coluna da tabela */
export interface ColumnConfig<T = Record<string, unknown>> {
  /** Chave única da coluna */
  key: string;
  /** Título exibido no cabeçalho da coluna */
  title: string;
  /** Largura da coluna (opcional) */
  width?: string;
  /** Se a coluna pode ser ordenada */
  sortable?: boolean;
  /** Função para renderizar o conteúdo da célula */
  render?: (item: T, index: number) => ReactNode;
  /** Função para extrair o valor para ordenação (se diferente do valor de exibição) */
  sortValue?: (item: T) => string | number | Date;
  /** Classes CSS adicionais para a coluna */
  className?: string;
  /** Classes CSS adicionais para o cabeçalho */
  headerClassName?: string;
  /** Se a coluna deve ser ocultada em mobile */
  hideOnMobile?: boolean;
  /** Função para ser chamada quando a linha é clicada */
  onColClick?: (item: T, index: number) => void;
}

/** Estado de ordenação atual */
export interface SortState {
  /** Chave da coluna sendo ordenada */
  column: string | null;
  /** Direção da ordenação */
  direction: SortDirection;
}

/** Props do componente TableListing */
export interface TableListingProps<T = Record<string, unknown>> {
  /** Array de itens a serem exibidos na tabela */
  items: T[];
  /** Configuração das colunas */
  columns: ColumnConfig<T>[];
  /** Estado inicial de ordenação */
  defaultSort?: SortState;
  /** Controle externo do estado de ordenação */
  sortState?: SortState | null;
  /** Função chamada quando a ordenação muda */
  onSortChange?: (sortState: SortState | null) => void;
  /** Se deve mostrar loading */
  loading?: boolean;
  /** Mensagem de loading personalizada */
  loadingMessage?: string;
  /** Classes CSS adicionais para a tabela */
  className?: string;
  /** Classes CSS adicionais para o container */
  containerClassName?: string;
  /** Se deve usar scroll horizontal em mobile */
  horizontalScrollOnMobile?: boolean;
  /** Função chamada quando uma linha é clicada */
  onRowClick?: (item: T, index: number) => void;
  /** Função para gerar key única para cada linha */
  getRowKey?: (item: T, index: number) => string;
  /** Se deve mostrar bordas zebradas */
  striped?: boolean;
  /** Se deve adicionar coluna de seleção com checkbox */
  withSelect?: boolean;
  /** Array de IDs dos itens selecionados */
  selecteds?: (string | number)[];
  /** Função chamada quando a seleção muda */
  onSelected?: (selectedIds: (string | number)[]) => void;
  /** Função para extrair o ID de um item (necessária quando withSelect é true) */
  getItemId?: (item: T) => string | number;
} 