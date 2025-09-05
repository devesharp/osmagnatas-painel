import { UsersListingPageItem } from "@/_pages/users-listing-page/users-listing-page.types";
import { api, APIResponse, APIResponseSearch } from "./base";
import { convertDataToSearchRequest, SearchRequestData } from "@/lib/api-utils";
import { User, UsersSearchFilters } from "@/types/user";

export const usersApi = {
  // Buscar usuários com filtros
  search: async (
    data: SearchRequestData
  ): Promise<APIResponseSearch<UsersListingPageItem>> => {
    const searchData = convertDataToSearchRequest(data);

    const params = new URLSearchParams();
    if (searchData.query?.sort) params.append('sort', searchData.query.sort);

    // Adicionar filtros de busca
    if (data.search) params.append('search', data.search);
    if (data.ativo !== undefined) params.append('ativo', data.ativo.toString());
    if (data.user_name) params.append('user_name', data.user_name);
    if (data.email) params.append('email', data.email);

    // Adicionar paginação
    if (searchData.query?.limit) params.append('limit', searchData.query.limit.toString());
    if (searchData.query?.offset) params.append('offset', searchData.query.offset.toString());

    const response = await api.get<APIResponse<APIResponseSearch<UsersListingPageItem>>>(
      `/users?${params.toString()}`
    );

    return response.data.data;
  },

  all: async (): Promise<UsersListingPageItem[]> => {
    const response = await api.get<APIResponse<APIResponseSearch<UsersListingPageItem>>>("/users?limit=1000");
    return response.data.data.results;
  },

  // Buscar usuário por ID
  getById: async (id: number): Promise<UsersListingPageItem> => {
    const response = await api.get<APIResponse<UsersListingPageItem>>(
      `/users/${id}`
    );

    return response.data.data;
  },

  // Criar novo usuário
  create: async (data: Partial<UsersListingPageItem>): Promise<UsersListingPageItem> => {
    const response = await api.post<APIResponse<UsersListingPageItem>>(
      "/users",
      {
        email: data.email,
        name: data.name,
        ativo: data.ativo,
        user_name: data.user_name,
      }
    );

    return response.data.data;
  },

  // Editar usuário existente
  update: async (id: number, data: Partial<UsersListingPageItem>): Promise<UsersListingPageItem> => {
    const response = await api.put<APIResponse<UsersListingPageItem>>(
      `/users/${id}`,
      {
        email: data.email,
        name: data.name,
        ativo: data.ativo,
        user_name: data.user_name,
      }
    );

    return response.data.data;
  },

  // Deletar usuário
  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Ativar/Desativar usuário
  toggleStatus: async (id: number): Promise<UsersListingPageItem> => {
    // Primeiro buscar o usuário atual
    const user = await usersApi.getById(id);

    // Atualizar o status
    return await usersApi.update(id, {
      ...user,
      ativo: !user.ativo
    });
  },
}; 