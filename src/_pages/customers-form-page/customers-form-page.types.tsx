import { CreateCustomerRequest, UpdateCustomerRequest, Customer } from "@/types/customer";

// Tipos para a página Customers Form Page

export interface CustomersFormPageProps {
  // Definir props se necessário
}

// Interface para os dados do formulário
export interface ICustomersFormPageForm {
  id?: number;
  name: string;
  person_type: 'PF' | 'PJ';
  email: string;
  phone?: string;
  cpf?: string;
  cnpj?: string;
  wallet_address?: string;
  access_website?: string;
  access_email?: string;
  access_password?: string;
}

// Tipos para as operações de criação e atualização
export type CustomerFormData = CreateCustomerRequest | UpdateCustomerRequest;
export type CustomerItem = Customer; 