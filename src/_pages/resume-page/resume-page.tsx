"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumePageCtrl } from "./resume-page.ctrl";
import { useAuth } from "@/contexts/auth-context";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CreditCard,
  AlertTriangle,
  Wallet,
  Calendar
} from "lucide-react";

// Funções auxiliares
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
};

export function ResumePage() {
  const ctrl = ResumePageCtrl();
  const { user } = useAuth();

  // Se não há dados ainda, mostra loading ou mensagem
  if (ctrl.loading) {
    return (
      <div className="w-full p-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Resumo Financeiro</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  const financial = ctrl.financial; // Dados filtrados por data
  const fixedFinancial = ctrl.fixedFinancial; // Dados fixos (total do caixa, inadimplência total)

  return (
    <div className="w-full p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Resumo Financeiro</h1>
        <p className="text-muted-foreground text-sm">
          Visão geral das suas finanças e transações
        </p>
      </div>

      {/* Filtro de Data */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Período:</span>
        </div>
        <DateRangePicker
          date={ctrl.dateRange}
          onDateChange={ctrl.setDateRange}
          placeholder="Últimos 15 dias"
          className="w-auto"
        />
      </div>

      {/* Cards de Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Total no Caixa */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total no Caixa</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(fixedFinancial.totalCaixa)}
            </div>
            <p className="text-xs text-muted-foreground">
              Disponível para uso
            </p>
          </CardContent>
        </Card>

        {/* Entrada este Mês */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entrada este Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(ctrl.financial?.entradaMes || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Recebimentos do mês
            </p>
          </CardContent>
        </Card>

        {/* Saída este Mês */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saída este Mês</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(ctrl.financial?.saidaMes || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Gastos do mês
            </p>
          </CardContent>
        </Card>

        {/* Inadimplência Atual */}
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inadimplência</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(fixedFinancial.inadimplenciaAtual)}
            </div>
            <p className="text-xs text-muted-foreground">
              Valores pendentes
            </p>
          </CardContent>
        </Card>

        {/* Saldo */}
        <Card className={`bg-gradient-to-br ${
          ctrl.customMetrics.saldoPeriodo >= 0
            ? 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20'
            : 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className={`h-4 w-4 ${
              ctrl.customMetrics.saldoPeriodo >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              ctrl.customMetrics.saldoPeriodo >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {formatCurrency(ctrl.customMetrics.saldoPeriodo)}
            </div>
            <p className="text-xs text-muted-foreground">
              Entradas - Saídas (período selecionado)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Período Selecionado */}
      {ctrl.dateRange && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Entrada no Período */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entrada no Período</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(ctrl.customMetrics.entradaPeriodo)}
              </div>
              <p className="text-xs text-muted-foreground">
                Recebimentos do período
              </p>
            </CardContent>
          </Card>

          {/* Saída no Período */}
          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saída no Período</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(ctrl.customMetrics.saidaPeriodo)}
              </div>
              <p className="text-xs text-muted-foreground">
                Gastos do período
              </p>
            </CardContent>
          </Card>

          {/* Saldo do Período */}
          <Card className={`bg-gradient-to-br border-l-4 ${
            ctrl.customMetrics.saldoPeriodo >= 0
              ? 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-l-emerald-500'
              : 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-l-orange-500'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo do Período</CardTitle>
              <DollarSign className={`h-4 w-4 ${
                ctrl.customMetrics.saldoPeriodo >= 0 ? 'text-emerald-600' : 'text-orange-600'
              }`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                ctrl.customMetrics.saldoPeriodo >= 0 ? 'text-emerald-600' : 'text-orange-600'
              }`}>
                {formatCurrency(ctrl.customMetrics.saldoPeriodo)}
              </div>
              <p className="text-xs text-muted-foreground">
                Entradas - Saídas do período
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráfico de Entradas e Saídas */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {ctrl.dateRange
                ? `Movimentação Financeira - ${ctrl.dateRange.from?.toLocaleDateString('pt-BR')} a ${ctrl.dateRange.to?.toLocaleDateString('pt-BR')}`
                : 'Movimentação Financeira - Últimos 15 Dias'
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ctrl.financial?.grafico15Dias || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    fontSize={12}
                  />
                  <YAxis
                    tickFormatter={(value) => `R$ ${value/1000}k`}
                    fontSize={12}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      const labels: Record<string, string> = {
                        'entrada': 'Entrada',
                        'saida': 'Saída',
                        'inadimplenciaCriada': 'Inadimplência Criada',
                        'inadimplenciaPaga': 'Inadimplência Paga'
                      };
                      return [formatCurrency(value), labels[name] || name];
                    }}
                    labelFormatter={(label) => `Data: ${formatDate(label)}`}
                  />
                  <Legend 
                    formatter={(value: string) => {
                      const labels: Record<string, string> = {
                        'entrada': 'Entrada',
                        'saida': 'Saída',
                        'inadimplenciaCriada': 'Inadimplência Criada',
                        'inadimplenciaPaga': 'Inadimplência Paga'
                      };
                      return labels[value] || value;
                    }}
                  />
                  <Bar
                    dataKey="entrada"
                    fill="#10b981"
                    name="entrada"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="saida"
                    fill="#ef4444"
                    name="saida"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="inadimplenciaCriada"
                    fill="#f59e0b"
                    name="inadimplenciaCriada"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="inadimplenciaPaga"
                    fill="#8b5cf6"
                    name="inadimplenciaPaga"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Estatísticas Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ctrl.fixedFinancial?.clientesAtivos || 0}</div>
            <p className="text-xs text-muted-foreground">
              <Button
                variant="link"
                className="h-auto p-0 text-xs"
                onClick={ctrl.goToCustomers}
              >
                Ver clientes →
              </Button>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações Totais</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ctrl.financial?.transactionsTotal || 0}</div>
            <p className="text-xs text-muted-foreground">
              <Button
                variant="link"
                className="h-auto p-0 text-xs"
                onClick={ctrl.goToTransactions}
              >
                Ver transações →
              </Button>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {ctrl.financial?.transactionsPendentes || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando pagamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {ctrl.financial?.transactionsPagas || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Concluídas com sucesso
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
