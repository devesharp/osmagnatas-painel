import axios, { AxiosError } from "axios";
import { getUrl } from "@/utils/environment";
import { AUTH_CONFIG } from "@/config/auth";

export interface APIResponse<T> {
  success: boolean;
  data: T;
}

export interface APIResponseSearch<T> {
  results: T[];
  count: number;
}

export interface APIFiltersSearch<T = Record<string, unknown>> {
  query: {
    sort: string;
    limit: number;
    offset: number;
  };
  filters:
    | {
        [key: string]:
          | string
          | number
          | boolean
          | Array<string | number | boolean>;
      }
    | T;
}

export interface APIError {
  success: false;
  data: {
    error: string;
    message: string;
    code: number;
    status_code: number;
  };
}

export const api = axios.create({
  baseURL: getUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de resposta para tratar erros de forma tipada
api.interceptors.response.use(
  // Resposta de sucesso - passa direto
  (response) => response,

  // Resposta de erro - transforma em APIError tipado
  (error: AxiosError<APIError>) => {
    // Verifica se é erro de autenticação (código 3) e faz logout automático
    if (error.response?.data?.data?.code === 3) {
      // Remove dados de autenticação do localStorage
      localStorage.removeItem(AUTH_CONFIG.TOKEN.KEY);
      localStorage.removeItem(AUTH_CONFIG.TOKEN.USER_KEY);

      // Remove header de autorização
      delete api.defaults.headers.common["Authorization"];

      // Redireciona para login se não estivermos já na página de login
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
    }

    // Se a resposta do servidor contém dados estruturados como APIError
    if (error.response?.data) {
      const apiError = {
        message:
          error.response.data.data.error ||
          error.response.data.data.message ||
          error.message ||
          "Erro desconhecido",
        code: error.response.data.data.code || error.response.status || 0,
        status_code: error.response.status || 0,
      };

      // Rejeita com o erro tipado
      return Promise.reject(apiError);
    }

    // Se não há resposta do servidor (erro de rede, timeout, etc.)
    const networkError = {
      message: error.message || "Erro desconhecido",
      code: 0,
      status_code: 0,
    };

    return Promise.reject(networkError);
  }
);
