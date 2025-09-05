export interface User {
  /** Nome do usuário */
  name: string;
  /** URL da foto do usuário */
  avatar?: string;
  /** Email do usuário */
  email?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type ContrastMode = 'normal' | 'high';

export interface AppSidebarUserProps {
  /** Dados do usuário */
  user: User;
  /** Função chamada quando o usuário clica no perfil */
  onUserClick?: () => void;
  /** Função chamada quando o usuário quer sair */
  onLogout?: () => void;
} 