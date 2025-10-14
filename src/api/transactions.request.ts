import { api, APIResponse } from "./base";
import { convertDataToSearchRequest, SearchRequestData } from "@/lib/api-utils";
import { Transaction, TransactionsSearchFilters, CreateTransactionRequest, UpdateTransactionRequest } from "@/types/transaction";

interface APIResponseSearchWithTotal<T> {
  results: T[];
  count: number;
  total: number;
}

export const transactionsApi = {
  // Buscar transactions com filtros
  search: async (
    data: SearchRequestData & TransactionsSearchFilters
  ): Promise<APIResponseSearchWithTotal<Transaction>> => {
    const searchData = convertDataToSearchRequest(data);

    const params = new URLSearchParams();
    if (data.sort) {
      const sortParam = data.sort.direction === 'asc' ? data.sort.column : `-${data.sort.column}`;
      params.append('sort', sortParam);
    }

    // Adicionar filtros de busca
    if (data.search) params.append('search', data.search);
    if (data.status && data.status != 'all') params.append('status', data.status);
    if (data.payment_type && data.payment_type != 'all') params.append('payment_type', data.payment_type);
    if (data.customer_id) params.append('customer_id', data.customer_id.toString());
    if (data.moeda) params.append('moeda', data.moeda);
    if (data.amount_min) params.append('amount_min', data.amount_min.toString());
    if (data.amount_max) params.append('amount_max', data.amount_max.toString());
    if (data.expired_at_start) params.append('expired_at_start', data.expired_at_start);
    if (data.expired_at_end) params.append('expired_at_end', data.expired_at_end);
    if (data.payed_at_start) params.append('payed_at_start', data.payed_at_start);
    if (data.payed_at_end) params.append('payed_at_end', data.payed_at_end);
    if (data.created_at_start) params.append('created_at_start', data.created_at_start);
    if (data.created_at_end) params.append('created_at_end', data.created_at_end);

    // Adicionar paginação
    if (searchData.query?.limit) params.append('limit', searchData.query.limit.toString());
    if (searchData.query?.offset) params.append('offset', searchData.query.offset.toString());

    const response = await api.get<APIResponse<APIResponseSearchWithTotal<Transaction>>>(
      `/transactions?${params.toString()}`
    );

    return response.data.data;
  },

  all: async (): Promise<Transaction[]> => {
    const response = await api.get<APIResponse<APIResponseSearchWithTotal<Transaction>>>("/transactions?limit=1000");
    return response.data.data.results;
  },

  // Buscar transaction por ID
  getById: async (id: number): Promise<Transaction> => {
    const response = await api.get<APIResponse<Transaction>>(
      `/transactions/${id}`
    );

    return response.data.data;
  },

  // Criar nova transaction
  create: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await api.post<APIResponse<Transaction>>(
      "/transactions",
      data
    );

    return response.data.data;
  },

  // Editar transaction existente
  update: async (id: number, data: UpdateTransactionRequest): Promise<Transaction> => {
    const response = await api.put<APIResponse<Transaction>>(
      `/transactions/${id}`,
      data
    );

    return response.data.data;
  },

  // Deletar transaction
  delete: async (id: number): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};
