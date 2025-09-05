/**
 * Tipo para os filtros de Users Listing Page
 */
export interface IUsersListingPageFilters {
  /** Campo de busca geral */
  search?: string;
  
  /** Nome de usuário */
  user_name?: string;
  
  /** Email do usuário */
  email?: string;
  
  /** Status do usuário (ativo/inativo) */
  ativo?: boolean;
  
  /** CRECI do usuário */
  creci?: string;
  
  // Campos de ordenação e paginação
  sort?: {
    column?: string;
    direction?: "asc" | "desc";
  };
  
  limit?: number;
  offset?: number;
}

/**
 * Props do componente principal de filtros
 */
export interface UsersListingPageFiltersProps {
  /** Controla a visibilidade do modal no mobile */
  isVisibleMobile?: boolean;
  /** Callback chamado quando o modal é fechado */
  onRequestClose?: () => void;
  /** Callback chamado quando os filtros são aplicados */
  onFiltersApply: (filters: IUsersListingPageFilters) => void;
  /** Valores iniciais dos filtros */
  filters: Partial<IUsersListingPageFilters>;
} 