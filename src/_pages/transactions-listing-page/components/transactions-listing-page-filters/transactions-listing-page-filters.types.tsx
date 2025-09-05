import { z } from "zod";

/**
 * Schema de validação para os filtros de Transactions Listing Page
 * Define todos os campos disponíveis para filtrar
 */
export const filterSchema = z.object({
  /** Campo de busca geral */
  search: z.string().optional(),

  /** Status da transação */
  status: z.enum(['PENDING', 'CANCELED', 'PAYED']).optional(),

  /** ID do cliente */
  customer_id: z.number().optional(),

  /** Moeda */
  moeda: z.string().optional(),

  /** Valor mínimo */
  amount_min: z.number().optional(),

  /** Valor máximo */
  amount_max: z.number().optional(),

  /** Limite de resultados */
  limit: z.number().optional(),

  /** Offset para paginação */
  offset: z.number().optional(),
});

/**
 * Tipo inferido do schema de filtros
 */
export type ITransactionsListingPageFilters = z.infer<typeof filterSchema>;

/**
 * Props do componente principal de filtros
 */
export interface TransactionsListingPageFiltersProps {
  /** Controla a visibilidade do modal no mobile */
  isVisibleMobile?: boolean;
  /** Callback chamado quando o modal é fechado */
  onRequestClose?: () => void;
  /** Callback chamado quando os filtros são aplicados */
  onFiltersApply: (filters: ITransactionsListingPageFilters) => void;
  /** Valores iniciais dos filtros */
  filters: Partial<ITransactionsListingPageFilters>;
} 