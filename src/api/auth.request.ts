import { User } from "@/types/user.types";
import { api, APIResponse, APIError } from "./base";

export interface LoginRequest {
  login: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  info: {
    BAIRROS: Array<{
      city: string;
      neighborhood: string;
    }>;
    CIDADES: Array<{
      city: string;
    }>;
    TIPOS: Array<{
      CODIGO: number;
      DESCRICAO: string;
      ATIVO: number;
    }>;
    TIPOS_BUSCA: Array<{
      CODIGO: number | string;
      DESCRICAO: string;
      ATIVO?: number;
    }>;
  };
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<APIResponse<AuthResponse>>("/auth/login", data);

    // Mapear a resposta da API Coruja para o formato esperado pela aplicação
    const corujaData = response.data.data;

    return corujaData;
  },

  me: async (): Promise<AuthResponse> => {
    const response = await api.get<APIResponse<AuthResponse>>("/auth/me");
    return response.data.data;
  },
};
