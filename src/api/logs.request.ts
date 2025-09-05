import { APIResponseSearch, Log, LogFilters } from "@/types/log";
import { api } from "./base";

/**
 * API para gerenciamento de logs
 */
export const logsApi = {
  /**
   * Buscar logs com filtros
   */
  search: async (filters: LogFilters = {}): Promise<APIResponseSearch<Log>> => {
    const params = new URLSearchParams();

    if (filters.user_id) params.append('user_id', filters.user_id.toString());
    if (filters.log_type) params.append('log_type', filters.log_type);
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const url = `/logs${queryString ? `?${queryString}` : ''}`;

    return (await api.get(url)).data.data;
  },
};
