"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerResumePageCtrl } from "./customer-resume-page.ctrl";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Building2,
  FileText,
  Wallet,
  Globe,
  Calendar,
  ArrowLeft,
  Edit,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Funções auxiliares
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Funções auxiliares
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};


// Função auxiliar para formatar data do gráfico (apenas dia/mês)
const formatDateChart = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
};

const formatDocument = (type: 'PF' | 'PJ', cpf?: string | null, cnpj?: string | null) => {
  if (type === 'PF' && cpf) {
    return {
      label: 'CPF',
      value: cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    };
  }
  if (type === 'PJ' && cnpj) {
    return {
      label: 'CNPJ',
      value: cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    };
  }
  return { label: '', value: '' };
};

export function CustomerResumePage() {
  const ctrl = CustomerResumePageCtrl();
  const { user } = useAuth();

  const financial = ctrl.financial; // Dados financeiros do cliente

  // Se está carregando
  if (ctrl.loading) {
    return (
      <div className="w-full p-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Resumo do Cliente</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando dados do cliente...</p>
        </div>
      </div>
    );
  }

  // Se houve erro
  if (ctrl.error) {
    return (
      <div className="w-full p-5">
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={ctrl.goToCustomers}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">Resumo do Cliente</h1>
          </div>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Erro: {ctrl.error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={ctrl.refreshData}
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se não há cliente
  if (!ctrl.customer) {
    return (
      <div className="w-full p-5">
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={ctrl.goToCustomers}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">Resumo do Cliente</h1>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Cliente não encontrado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const customer = ctrl.customer;
  const documentInfo = formatDocument(customer.person_type, customer.cpf, customer.cnpj);

  return (
    <div className="w-full p-5">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={ctrl.goToCustomers}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Resumo do Cliente</h1>
              <p className="text-muted-foreground text-sm">
                Informações detalhadas do cliente {customer.name}
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href={`/customers/form/${customer.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Cliente
            </Link>
          </Button>
        </div>
      </div>

      {/* Cards de Informações Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Informações Básicas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Informações Básicas</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Nome</p>
              <p className="font-medium">{customer.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">E-mail</p>
              <p className="font-medium">{customer.email}</p>
            </div>
            {customer.phone && (
              <div>
                <p className="text-xs text-muted-foreground">Telefone</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tipo de Pessoa e Documento */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documento</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Tipo</p>
              <p className="font-medium">
                {customer.person_type === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </p>
            </div>
            {documentInfo.value && (
              <div>
                <p className="text-xs text-muted-foreground">{documentInfo.label}</p>
                <p className="font-medium">{documentInfo.value}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações de Acesso */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acesso</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            {customer.access_website && (
              <div>
                <p className="text-xs text-muted-foreground">Website</p>
                <p className="font-medium truncate">{customer.access_website}</p>
              </div>
            )}
            {customer.access_email && (
              <div>
                <p className="text-xs text-muted-foreground">E-mail de Acesso</p>
                <p className="font-medium truncate">{customer.access_email}</p>
              </div>
            )}
            {customer.wallet_address && (
              <div>
                <p className="text-xs text-muted-foreground">Carteira</p>
                <p className="font-medium truncate">{customer.wallet_address}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cards de Informações do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Informações de Criação */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Informações do Sistema</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Criado em</p>
              <p className="font-medium">{formatDate(customer.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Última atualização</p>
              <p className="font-medium">{formatDate(customer.updatedAt)}</p>
            </div>
            {customer.creator && (
              <div>
                <p className="text-xs text-muted-foreground">Criado por</p>
                <p className="font-medium">{customer.creator.user_name} ({customer.creator.email})</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ações Rápidas</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/customers/${customer.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Cliente
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/transactions?customer_id=${customer.id}`}>
                  Ver Transações
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Métricas Financeiras do Cliente */}
      {financial && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total no Caixa do Cliente */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total no Caixa</CardTitle>
                <Wallet className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(financial.totalCaixa)}
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
                  {formatCurrency(financial.entradaMes)}
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
                  {formatCurrency(financial.saidaMes)}
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
                  {formatCurrency(financial.inadimplenciaAtual)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Valores pendentes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Entradas e Saídas do Cliente */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Movimentação Financeira - Últimos 30 Dias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financial.grafico30Dias || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatDateChart}
                        fontSize={12}
                      />
                      <YAxis
                        tickFormatter={(value) => `R$ ${value/1000}k`}
                        fontSize={12}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => {
                          const labels = {
                            'entrada': 'Entrada',
                            'saida': 'Saída', 
                            'inadimplenciaCriada': 'Inadimplência Criada',
                            'inadimplenciaPaga': 'Inadimplência Paga'
                          };
                          return [formatCurrency(value), labels[name as keyof typeof labels]];
                        }}
                        labelFormatter={(label) => `Data: ${formatDateChart(label)}`}
                      />
                      <Legend 
                        formatter={(value) => {
                          const labels = {
                            'entrada': 'Entrada',
                            'saida': 'Saída',
                            'inadimplenciaCriada': 'Inadimplência Criada', 
                            'inadimplenciaPaga': 'Inadimplência Paga'
                          };
                          return labels[value as keyof typeof labels];
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
                        fill="#6366f1"
                        name="inadimplenciaPaga"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cards de Estatísticas de Transações */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transações Totais</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{financial.transactionsTotal}</div>
                <p className="text-xs text-muted-foreground">
                  Movimentações realizadas
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
                  {financial.transactionsPendentes}
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
                  {financial.transactionsPagas}
                </div>
                <p className="text-xs text-muted-foreground">
                  Concluídas com sucesso
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
} 