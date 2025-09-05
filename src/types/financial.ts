export interface FinancialData {
  // Métricas principais
  totalCaixa: number;
  entradaMes: number;
  saidaMes: number;
  inadimplenciaAtual: number;
  saldo: number;

  // Gráfico dos últimos 15 dias
  grafico15Dias: Array<{
    date: string;
    entrada: number;
    saida: number;
  }>;

  // Métricas adicionais
  clientesAtivos: number;
  transactionsTotal: number;
  transactionsPendentes: number;
  transactionsPagas: number;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
}
