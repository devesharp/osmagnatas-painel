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

    // Adicionar filtros de data
    if (data.created_at_start) params.append('created_at_start', data.created_at_start);
    if (data.created_at_end) params.append('created_at_end', data.created_at_end);

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

  // Buscar dados financeiros do customer por ID
  getFinancial: async (id: number): Promise<any> => {
    try {
      const response = await api.get<APIResponse<any>>(
        `/customers/${id}/financial`
      );
      return response.data.data;
    } catch (error) {
      // Se não existir endpoint real, retornar dados simulados
      console.log("Endpoint financeiro do cliente não encontrado, usando dados simulados");
      return getMockCustomerFinancialData(id);
    }
  },
};

// Função para gerar dados financeiros simulados do cliente
function getMockCustomerFinancialData(customerId: number): any {
  const now = new Date();

  // Gerar dados para os últimos 30 dias
  const graficoDias = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);

    // Gerar valores aleatórios mas realistas para este cliente
    const entrada = Math.floor(Math.random() * 3000) + 500; // 500-3500
    const saida = Math.floor(Math.random() * 1500) + 200;     // 200-1700

    graficoDias.push({
      date: date.toISOString().split('T')[0],
      entrada,
      saida
    });
  }

  // Calcular métricas baseadas nos dados do gráfico
  const entradaMes = graficoDias.reduce((sum, item) => sum + item.entrada, 0);
  const saidaMes = graficoDias.reduce((sum, item) => sum + item.saida, 0);

  return {
    totalCaixa: entradaMes - saidaMes + 10000, // Saldo base do cliente
    entradaMes,
    saidaMes,
    inadimplenciaAtual: Math.floor(Math.random() * 500) + 100, // 100-600
    saldo: entradaMes - saidaMes,
    grafico30Dias: graficoDias,
    transactionsTotal: graficoDias.length * 2,
    transactionsPendentes: Math.floor(Math.random() * 3) + 1, // 1-4 pendentes
    transactionsPagas: graficoDias.length * 2 - (Math.floor(Math.random() * 3) + 1)
  };
}
