// Tipos para a página de resumo do cliente

export interface CustomerResumePageProps {
  // Definir props se necessário
}

// Interface para os dados do resumo do cliente (compatível com Customer)
export interface ICustomerResumeData {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  person_type: 'PF' | 'PJ';
  cpf?: string | null;
  cnpj?: string | null;
  wallet_address?: string | null;
  access_website?: string | null;
  access_email?: string | null;
  access_password?: string | null;
  created_by: number;
  createdAt: Date;
  updatedAt: Date;
  creator?: {
    id: number;
    email: string;
    user_name?: string | null;
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