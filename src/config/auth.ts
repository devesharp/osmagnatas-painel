/**
 * Configuração do Sistema de Autenticação
 * 
 * Para desabilitar completamente o sistema de autenticação:
 * 1. Mude AUTH_ENABLED para false
 * 2. Todas as rotas ficarão acessíveis sem login
 * 3. As páginas de login/registro continuarão funcionando mas não serão obrigatórias
 */

export const AUTH_CONFIG = {
  // Habilita/desabilita o sistema de autenticação
  AUTH_ENABLED: true,
  
  // Rotas de redirecionamento
  ROUTES: {
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/',
    PROPERTIES_LISTING: '/properties/listing',
    HOME: '/',
  },
  
  // Configurações de token
  TOKEN: {
    KEY: 'auth_token',
    USER_KEY: 'auth_user',
  },
  
  // Mensagens do sistema
  MESSAGES: {
    LOGIN_SUCCESS: 'Login realizado com sucesso!',
    REGISTER_SUCCESS: 'Conta criada com sucesso!',
    LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
    LOGIN_ERROR: 'Erro ao fazer login',
    REGISTER_ERROR: 'Erro ao criar conta',
    AUTH_ERROR: 'Erro ao verificar autenticação',
  }
} as const

export type AuthConfig = typeof AUTH_CONFIG 