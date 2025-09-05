export interface User {
  /** Nome do usuário */
  name: string;
  /** URL da foto do usuário */
  avatar?: string;
  /** Email do usuário */
  email?: string;
}

export interface MenuItem {
  /** Título do item do menu */
  title: string;
  /** URL de navegação */
  url: string;
  /** Ícone do item (componente Lucide React) */
  icon?: React.ComponentType<{ className?: string }>;
  /** Indica se o item está ativo */
  isActive?: boolean;
  /** Sub-itens do menu */
  items?: MenuItem[];
}

export interface MenuGroup {
  /** Título do grupo */
  title: string;
  /** Itens do grupo */
  items: MenuItem[];
}

export interface AppSidebarProps {
  /** Dados do usuário logado */
  user: User;
  /** Função chamada quando um item do menu é clicado */
  onMenuItemClick?: (url: string) => void;
  /** Função chamada quando o usuário clica no perfil */
  onUserClick?: () => void;
  /** Pathname atual para destacar item ativo */
  currentPath?: string;
  /** Estado inicial do collapse (padrão: false - expandido) */
  defaultCollapsed?: boolean;
  /** Controle externo do estado de collapse */
  collapsed?: boolean;
  /** Função chamada quando o estado de collapse muda */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Função chamada quando o usuário quer sair */
  onLogout?: () => void;
} 