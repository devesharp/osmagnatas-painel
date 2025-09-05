"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { authApi, AuthResponse } from "@/api/auth.request";
import { toast } from "sonner";
import { AUTH_CONFIG } from "@/config/auth";
import { User } from "@/types/user.types";
import { api } from "@/api/base";
import { useInfo } from "@/hooks/use-info/use-info";
import posthog from "posthog-js";
import useDeepEffect from "@lucarestagno/use-deep-effect";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean | string>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  enabled?: boolean; // Permite desabilitar o sistema de auth
}

export function AuthProvider({ children, enabled = true }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setInfo } = useInfo();

  // Se o auth estiver desabilitado, sempre retorna como autenticado
  const isAuthenticated = enabled ? !!user : true;

  useLayoutEffect(() => {
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${localStorage.getItem(AUTH_CONFIG.TOKEN.KEY)}`;
  }, []);

  const saveAuthData = (authResponse: AuthResponse) => {
    localStorage.setItem(AUTH_CONFIG.TOKEN.KEY, authResponse.access_token);
    localStorage.setItem(
      AUTH_CONFIG.TOKEN.USER_KEY,
      JSON.stringify(authResponse.user)
    );
    setUser(authResponse.user);
  };

  const clearAuthData = () => {
    localStorage.removeItem(AUTH_CONFIG.TOKEN.KEY);
    localStorage.removeItem(AUTH_CONFIG.TOKEN.USER_KEY);
    setUser(null);
  };

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse | string> => {
    if (!enabled) return true;

    try {
      const response = await authApi.login({ login: email, password });
      saveAuthData(response);
      setInfo(response.info);
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.access_token}`;
      return response;
    } catch (error: unknown) {
      console.log(error);

      const message = (error as { message?: string }).message ||
        AUTH_CONFIG.MESSAGES.LOGIN_ERROR;

      return message;
    } finally {
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<boolean> => {
    if (!enabled) return true;

    return false;
  };

  const logout = () => {
    clearAuthData();
    toast.success(AUTH_CONFIG.MESSAGES.LOGOUT_SUCCESS);
  };

  const checkAuth = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem(AUTH_CONFIG.TOKEN.KEY);
      const userData = localStorage.getItem(AUTH_CONFIG.TOKEN.USER_KEY);

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }

      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await authApi.me();

        localStorage.setItem(
          AUTH_CONFIG.TOKEN.USER_KEY,
          JSON.stringify(response.user)
        );
        setUser(response.user);
        setInfo(response.info);
      }
    } catch (error) {
      console.error(AUTH_CONFIG.MESSAGES.AUTH_ERROR, error);
      // clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    checkAuth();
  }, [enabled, checkAuth]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
