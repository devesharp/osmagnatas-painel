import { z } from "zod";

/**
 * Schema de validação para os filtros de Clientes
 * Define todos os campos disponíveis para filtrar
 */
export const filterSchema = z.object({
  /** Campo de busca geral */
  search: z.string().optional(),

  /** Tipo de pessoa (PF/PJ) */
  person_type: z.enum(['PF', 'PJ']).optional(),

  /** Nome do cliente */
  name: z.string().optional(),

  /** Email do cliente */
  email: z.string().optional(),
});

/**
 * Tipo inferido do schema de filtros
 */
export type ICustomersListingPageFilters = z.infer<typeof filterSchema>;

/**
 * Props do componente principal de filtros
 */
export interface CustomersListingPageFiltersProps {
  /** Controla a visibilidade do modal no mobile */
  isVisibleMobile?: boolean;
  /** Callback chamado quando o modal é fechado */
  onRequestClose?: () => void;
  /** Callback chamado quando os filtros são aplicados */
  onFiltersApply: (filters: ICustomersListingPageFilters) => void;
  /** Valores iniciais dos filtros */
  filters: Partial<ICustomersListingPageFilters>;
} 