import { api, APIResponse } from "./base";
import { FinancialData } from "@/types/financial";
import { DateRange } from "react-day-picker";

// Re-exportando para facilitar o uso
export type { FinancialData } from "@/types/financial";

export interface ResumeData {
  desatualizados: {
    quantidade: number;
    vencidos: number;
    maximo_dias: number;
    dias_para_vencimento: number;
    quantidade_vencidos_proximo: number;
  };
  desatualizados_outros: Array<{
    id: number;
    nome: string;
    quantidade: number;
    vencidos: number;
    maximo_dias: number;
    dias_para_vencimento: number;
    quantidade_vencidos_proximo: number;
  }>;
}


export const resumeApi = {
  // Buscar dados do dashboard
  dashboard: async (data: unknown): Promise<ResumeData> => {
    const response = await api.get<APIResponse<ResumeData>>("/dashboard");

    return response.data.data;
  },

  // Buscar dados financeiros
  financial: async (dateRange?: DateRange): Promise<FinancialData> => {
    try {
      // Tentar buscar da API real primeiro
      const params: Record<string, string> = {};

      if (dateRange?.from) {
        params.start_date = dateRange.from.toISOString().split('T')[0];
      }

      if (dateRange?.to) {
        params.end_date = dateRange.to.toISOString().split('T')[0];
      }

      const response = await api.get<APIResponse<FinancialData>>("/financial", { params });
      return response.data.data;
    } catch (error) {
      // Se não existir endpoint real, retornar dados simulados
      console.log("Endpoint financeiro não encontrado, usando dados simulados");
      return getMockFinancialData(dateRange);
    }
  },

  myIP: async (): Promise<{ ip: string }> => {
    const response = await api.get<APIResponse<{ ip: string }>>("/my-ip");
    return response.data.data;
  },
};

// Função para gerar dados financeiros simulados
function getMockFinancialData(dateRange?: DateRange): FinancialData {
  const now = new Date();

  // Se há um range de datas especificado, usar esse período
  const startDate = dateRange?.from || new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const endDate = dateRange?.to || now;

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const graficoDias = [];

  // Gerar dados para o período especificado
  for (let i = diffDays; i >= 0; i--) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + (diffDays - i));

    // Gerar valores aleatórios mas realistas
    const entrada = Math.floor(Math.random() * 5000) + 1000; // 1000-6000
    const saida = Math.floor(Math.random() * 3000) + 500;     // 500-3500

    graficoDias.push({
      date: date.toISOString().split('T')[0],
      entrada,
      saida,
      inadimplenciaCriada: Math.floor(Math.random() * 1000),
      inadimplenciaPaga: Math.floor(Math.random() * 800)
    });
  }

  // Calcular métricas baseadas nos dados do gráfico
  const entradaMes = graficoDias.reduce((sum, item) => sum + item.entrada, 0);
  const saidaMes = graficoDias.reduce((sum, item) => sum + item.saida, 0);

  // Calcular inadimplência (simulada)
  const transactionsPendentes = Math.floor(Math.random() * 20) + 5;
  const valorInadimplencia = transactionsPendentes * (Math.random() * 1000 + 200);

  return {
    totalCaixa: entradaMes - saidaMes - valorInadimplencia + 50000, // Saldo base
    entradaMes,
    saidaMes,
    inadimplenciaAtual: valorInadimplencia,
    saldo: entradaMes - saidaMes - valorInadimplencia,
    grafico15Dias: graficoDias, // Mantém o nome da propriedade original
    clientesAtivos: Math.floor(Math.random() * 50) + 20,
    clientesInadimplentes: Math.floor(Math.random() * 10) + 2,
    transactionsTotal: graficoDias.length * 3,
    transactionsPendentes,
    transactionsPagas: graficoDias.length * 2
  };
}
