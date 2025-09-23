import { api, APIResponse } from "./base";
import { convertDataToSearchRequest, SearchRequestData } from "@/lib/api-utils";
import { Inadimplencia, InadimplenciaSearchFilters, CreateInadimplenciaRequest, UpdateInadimplenciaRequest } from "@/types/inadimplencia";

interface APIResponseSearchWithTotal<T> {
  results: T[];
  count: number;
  total: number;
}

export const inadimplenciaApi = {
  // Buscar inadimplências com filtros
  search: async (
    data: SearchRequestData & InadimplenciaSearchFilters
  ): Promise<APIResponseSearchWithTotal<Inadimplencia>> => {
    const searchData = convertDataToSearchRequest(data);

    const params = new URLSearchParams();
    if (data.sort) {
      const sortParam = data.sort.direction === 'asc' ? data.sort.column : `-${data.sort.column}`;
      params.append('sort', sortParam);
    }

    // Adicionar filtros de busca
    if (data.search) params.append('search', data.search);
    if (data.payed !== undefined) params.append('payed', data.payed.toString());
    if (data.customer_id) params.append('customer_id', data.customer_id.toString());
    if (data.amount_min) params.append('amount_min', data.amount_min.toString());
    if (data.amount_max) params.append('amount_max', data.amount_max.toString());

    // Adicionar paginação
    if (searchData.query?.limit) params.append('limit', searchData.query.limit.toString());
    if (searchData.query?.offset) params.append('offset', searchData.query.offset.toString());

    const response = await api.get<APIResponse<APIResponseSearchWithTotal<Inadimplencia>>>(
      `/inadimplencia?${params.toString()}`
    );

    return response.data.data;
  },

  all: async (): Promise<Inadimplencia[]> => {
    const response = await api.get<APIResponse<APIResponseSearchWithTotal<Inadimplencia>>>("/inadimplencia?limit=1000");
    return response.data.data.results;
  },

  // Buscar inadimplência por ID
  getById: async (id: number): Promise<Inadimplencia> => {
    const response = await api.get<APIResponse<Inadimplencia>>(
      `/inadimplencia/${id}`
    );

    return response.data.data;
  },

  // Criar nova inadimplência
  create: async (data: CreateInadimplenciaRequest): Promise<Inadimplencia> => {
    const response = await api.post<APIResponse<Inadimplencia>>(
      "/inadimplencia",
      data
    );

    return response.data.data;
  },

  // Editar inadimplência existente
  update: async (id: number, data: UpdateInadimplenciaRequest): Promise<Inadimplencia> => {
    const response = await api.put<APIResponse<Inadimplencia>>(
      `/inadimplencia/${id}`,
      data
    );

    return response.data.data;
  },

  // Deletar inadimplência
  delete: async (id: number): Promise<void> => {
    await api.delete(`/inadimplencia/${id}`);
  },
};
