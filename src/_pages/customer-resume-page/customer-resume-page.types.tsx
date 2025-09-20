// Tipos para a página de resumo do cliente

export interface CustomerResumePageProps {
  // Definir props se necessário
}

// Interface para os dados do resumo do cliente
export interface ICustomerResumeData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  person_type: 'PF' | 'PJ';
  cpf?: string;
  cnpj?: string;
  wallet_address?: string;
  access_website?: string;
  access_email?: string;
  created_at: string;
  updated_at: string;
  creator?: {
    id: number;
    email: string;
    user_name: string;
  };
}

// Interface para formatação de dados
export interface IFormattedCustomerData extends ICustomerResumeData {
  formattedCreatedAt: string;
  formattedUpdatedAt: string;
  personTypeLabel: string;
  documentLabel: string;
  documentValue: string;
} 