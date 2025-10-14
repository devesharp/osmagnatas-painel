import { z } from "zod";
import { LogType } from "@/types/log";

/**
 * Schema de validação para os filtros de Logs Listing Page
 * Define todos os campos disponíveis para filtrar
 */
export const filterSchema = z.object({
  /** ID do usuário */
  user_id: z.string().optional().transform((val) => val ? parseInt(val) : undefined),

  /** Tipo de log/ação */
  log_type: z.string().optional().transform((val) => val as LogType | undefined),

  /** Data inicial */
  date_from: z.string().optional(),

  /** Data final */
  date_to: z.string().optional(),

  /** Limite de resultados */
  limit: z.string().optional().transform((val) => val ? parseInt(val) : undefined),

  /** Offset para paginação */
  offset: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
});

/**
 * Tipo inferido do schema de filtros
 */
export type ILogsListingPageFilters = z.infer<typeof filterSchema>;

/**
 * Props do componente principal de filtros
 */
export interface LogsListingPageFiltersProps {
  /** Controla a visibilidade do modal no mobile */
  isVisibleMobile?: boolean;
  /** Callback chamado quando o modal é fechado */
  onRequestClose?: () => void;
  /** Callback chamado quando os filtros são aplicados */
  onFiltersApply: (filters: ILogsListingPageFilters) => void;
  /** Valores iniciais dos filtros */
  filters: Partial<ILogsListingPageFilters>;
}

