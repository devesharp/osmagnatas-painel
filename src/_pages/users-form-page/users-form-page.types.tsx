// Tipos para a página Users Form Page

export interface UsersFormPageProps {
  // Definir props se necessário
}

// Interface para os dados de configuração
export interface IUsersFormPageForm {
  id?: number;
  name?: string;
  description?: string;
  code?: string;
  email?: string;
  phone?: string;
  active?: boolean;
  notifications?: boolean;
  notes?: string;
  // TODO: Adicionar campos específicos da configuração
} 