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

  /** Tipo de pagamento */
  payment_type: z.enum(['IN', 'OUT']).optional(),

  /** ID do cliente */
  customer_id: z.number().optional(),

  /** Moeda */
  moeda: z.string().optional(),

  /** Valor mínimo */
  amount_min: z.number().optional(),

  /** Valor máximo */
  amount_max: z.number().optional(),

  /** Data de vencimento inicial */
  expired_at_start: z.string().optional(),

  /** Data de vencimento final */
  expired_at_end: z.string().optional(),

  /** Data de pagamento inicial */
  payed_at_start: z.string().optional(),

  /** Data de pagamento final */
  payed_at_end: z.string().optional(),

  /** Data de criação inicial */
  created_at_start: z.string().optional(),

  /** Data de criação final */
  created_at_end: z.string().optional(),

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