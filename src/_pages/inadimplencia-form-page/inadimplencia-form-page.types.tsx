import { Inadimplencia, CreateInadimplenciaRequest, UpdateInadimplenciaRequest } from "@/types/inadimplencia";

// Tipos para a página Inadimplencia Form Page

export interface InadimplenciaFormPageProps {
  id?: string; // ID da inadimplência para edição
}

// Interface para os dados do formulário
export interface IInadimplenciaFormPageForm {
  id?: number;
  customer_id: number;
  amount: number;
  payed: boolean;
  notes?: string;
}

// Tipo para a resposta da API
export type InadimplenciaFormItem = Inadimplencia; 