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
    inadimplenciaCriada: number;
    inadimplenciaPaga: number;
  }>;

  // Métricas adicionais
  clientesAtivos: number;
  clientesInadimplentes: number;
  transactionsTotal: number;
  transactionsPendentes: number;
  transactionsPagas: number;
  totalGramsPeriodo: number;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
}
