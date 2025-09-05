import { api, APIResponse } from "./base";
import { FinancialData } from "@/types/financial";

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
  financial: async (): Promise<FinancialData> => {
    try {
      // Tentar buscar da API real primeiro
      const response = await api.get<APIResponse<FinancialData>>("/financial");
      return response.data.data;
    } catch (error) {
      // Se não existir endpoint real, retornar dados simulados
      console.log("Endpoint financeiro não encontrado, usando dados simulados");
      return getMockFinancialData();
    }
  },

  myIP: async (): Promise<{ ip: string }> => {
    const response = await api.get<APIResponse<{ ip: string }>>("/my-ip");
    return response.data.data;
  },
};

// Função para gerar dados financeiros simulados
function getMockFinancialData(): FinancialData {
  const now = new Date();
  const grafico15Dias = [];

  // Gerar dados dos últimos 15 dias
  for (let i = 14; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);

    // Gerar valores aleatórios mas realistas
    const entrada = Math.floor(Math.random() * 5000) + 1000; // 1000-6000
    const saida = Math.floor(Math.random() * 3000) + 500;     // 500-3500

    grafico15Dias.push({
      date: date.toISOString().split('T')[0],
      entrada,
      saida
    });
  }

  // Calcular métricas baseadas nos dados do gráfico
  const entradaMes = grafico15Dias.reduce((sum, item) => sum + item.entrada, 0);
  const saidaMes = grafico15Dias.reduce((sum, item) => sum + item.saida, 0);

  // Calcular inadimplência (simulada)
  const transactionsPendentes = Math.floor(Math.random() * 20) + 5;
  const valorInadimplencia = transactionsPendentes * (Math.random() * 1000 + 200);

  return {
    totalCaixa: entradaMes - saidaMes - valorInadimplencia + 50000, // Saldo base
    entradaMes,
    saidaMes,
    inadimplenciaAtual: valorInadimplencia,
    saldo: entradaMes - saidaMes - valorInadimplencia,
    grafico15Dias,
    clientesAtivos: Math.floor(Math.random() * 50) + 20,
    transactionsTotal: grafico15Dias.length * 3,
    transactionsPendentes,
    transactionsPagas: grafico15Dias.length * 2
  };
}
