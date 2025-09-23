import { z } from "zod";

/**
 * Schema de validação para os filtros de Inadimplencia Listing Page
 * Define todos os campos disponíveis para filtrar
 */
export const filterSchema = z.object({
  /** Campo de busca geral */
  search: z.string().optional(),

  /** Status de pagamento */
  payed: z.string().optional().transform((val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return undefined;
  }),

  /** ID do customer */
  customer_id: z.string().optional().transform((val) => val ? parseInt(val) : undefined),

  /** Valor mínimo */
  amount_min: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),

  /** Valor máximo */
  amount_max: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),

  /** Limite de resultados */
  limit: z.string().optional().transform((val) => val ? parseInt(val) : undefined),

  /** Offset para paginação */
  offset: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
});

/**
 * Tipo inferido do schema de filtros
 */
export type IInadimplenciaListingPageFilters = z.infer<typeof filterSchema>;

/**
 * Props do componente principal de filtros
 */
export interface InadimplenciaListingPageFiltersProps {
  /** Controla a visibilidade do modal no mobile */
  isVisibleMobile?: boolean;
  /** Callback chamado quando o modal é fechado */
  onRequestClose?: () => void;
  /** Callback chamado quando os filtros são aplicados */
  onFiltersApply: (filters: IInadimplenciaListingPageFilters) => void;
  /** Valores iniciais dos filtros */
  filters: Partial<IInadimplenciaListingPageFilters>;
} 