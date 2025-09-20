import { api, APIResponse } from "./base";
import { convertDataToSearchRequest, SearchRequestData } from "@/lib/api-utils";
import { Customer, CustomersSearchFilters, CreateCustomerRequest, UpdateCustomerRequest } from "@/types/customer";

interface APIResponseSearchWithTotal<T> {
  results: T[];
  count: number;
  total: number;
}

export const customersApi = {
  // Buscar customers com filtros
  search: async (
    data: SearchRequestData & CustomersSearchFilters
  ): Promise<APIResponseSearchWithTotal<Customer>> => {
    const searchData = convertDataToSearchRequest(data);

    const params = new URLSearchParams();
    if (data.sort) {
      const sortParam = data.sort.direction === 'asc' ? data.sort.column : `-${data.sort.column}`;
      params.append('sort', sortParam);
    }

    // Adicionar filtros de busca
    if (data.search) params.append('search', data.search);
    if (data.person_type) params.append('person_type', data.person_type);
    if (data.name) params.append('name', data.name);
    if (data.email) params.append('email', data.email);

    // Adicionar paginação
    if (searchData.query?.limit) params.append('limit', searchData.query.limit.toString());
    if (searchData.query?.offset) params.append('offset', searchData.query.offset.toString());

    const response = await api.get<APIResponse<APIResponseSearchWithTotal<Customer>>>(
      `/customers?${params.toString()}`
    );

    return response.data.data;
  },

  all: async (): Promise<Customer[]> => {
    const response = await api.get<APIResponse<APIResponseSearchWithTotal<Customer>>>("/customers?limit=1000");
    return response.data.data.results;
  },

  // Buscar customer por ID
  getById: async (id: number): Promise<Customer> => {
    const response = await api.get<APIResponse<Customer>>(
      `/customers/${id}`
    );

    return response.data.data;
  },

  // Criar novo customer
  create: async (data: CreateCustomerRequest): Promise<Customer> => {
    const response = await api.post<APIResponse<Customer>>(
      "/customers",
      data
    );

    return response.data.data;
  },

  // Editar customer existente
  update: async (id: number, data: UpdateCustomerRequest): Promise<Customer> => {
    const response = await api.put<APIResponse<Customer>>(
      `/customers/${id}`,
      data
    );

    return response.data.data;
  },

  // Deletar customer
  delete: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },

  // Buscar resumo do customer por ID
  getResume: async (id: number): Promise<Customer> => {
    const response = await api.get<APIResponse<Customer>>(
      `/customers/${id}/resume`
    );

    return response.data.data;
  },
};
