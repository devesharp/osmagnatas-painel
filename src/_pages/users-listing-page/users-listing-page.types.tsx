// Tipos para a página Users Listing Page

export interface UsersListingPageProps {
  // Definir props se necessário
}

// Interface baseada na resposta da API - modelo simplificado
export interface UsersListingPageItem {
  id: number;
  email: string;
  user_name?: string | null;
  telefone?: string | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;

  // Campos de compatibilidade para manter interface existente
  CODIGO: number;
  EMAIL: string;
  USER_NAME?: string;
  TELEFONE_01?: string;
  ATIVO: number;
} 