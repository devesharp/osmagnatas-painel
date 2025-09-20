import { DateRange } from "react-day-picker";

// Tipos para a página Resume Page

export interface ResumePageProps {
  // Definir props se necessário
}

export interface ResumePageItem {
  // Definir estrutura do item se necessário
}

// Tipos para as métricas customizadas baseadas no período selecionado
export interface CustomMetrics {
  entradaPeriodo: number;
  saidaPeriodo: number;
  saldoPeriodo: number;
}

// Interface para o controlador da página de resumo
export interface ResumePageCtrlReturn {
  view: any;
  financial: any; // Dados filtrados por data
  fixedFinancial: any; // Dados fixos (sem filtro de data)
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
  goToTransactions: () => void;
  goToCustomers: () => void;
  customMetrics: CustomMetrics;
  formatDateForAPI: (date: Date) => string;
} 