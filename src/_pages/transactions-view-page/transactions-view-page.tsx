"use client";

import { Button } from "@/components/ui/button";
import { TransactionsViewPageCtrl } from "./transactions-view-page.ctrl";
import { ViewFormProvider } from "@devesharp/react-hooks-v2";
import { LoadingForeground } from "@/components/loading-foreground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Calendar, DollarSign, FileText, User } from "lucide-react";

// Componente auxiliar para exibir informações
function InfoField({ 
  label, 
  value, 
  icon: Icon 
}: { 
  label: string; 
  value: string | number; 
  icon?: any;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <label className="text-sm font-medium text-muted-foreground">{label}</label>
      </div>
      <p className="text-base">{value}</p>
    </div>
  );
}

export function TransactionsViewPage() {
  const ctrl = TransactionsViewPageCtrl();

  return (
    <div className="w-full flex flex-col h-full relative">
      <LoadingForeground visible={ctrl.viewResource.isLoading} />
      
      <div className="w-full flex-1 overflow-y-auto p-5">
        {/* Header */}
        <div className="pb-8">
          <div className="mx-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={ctrl.handleBack}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-semibold">
                    Detalhes da Transação
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Visualize as informações completas da transação
                  </p>
                </div>
              </div>
              <Button onClick={ctrl.handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl">
          <ViewFormProvider {...ctrl.viewResource}>
            {ctrl.viewResource.error && (
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Erro ao carregar transação</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {ctrl.viewResource.error.message || "Ocorreu um erro inesperado"}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    Tentar novamente
                  </Button>
                </CardContent>
              </Card>
            )}

            {ctrl.transaction && (
              <div className="space-y-6">
                {/* Card de Status e Tipo */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Gerais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                        <div>
                          <Badge 
                            variant={
                              ctrl.transaction.status === "PAYED" 
                                ? "default" 
                                : ctrl.transaction.status === "CANCELED"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {ctrl.getStatusLabel(ctrl.transaction.status)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Tipo de Pagamento</label>
                        <div>
                          <Badge variant="outline">
                            {ctrl.getPaymentTypeLabel(ctrl.transaction.payment_type)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Card de Valores */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Valores</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoField
                        icon={DollarSign}
                        label="Valor"
                        value={ctrl.formatAmount(ctrl.transaction.amount, ctrl.transaction.moeda)}
                      />
                      
                      <InfoField
                        label="Moeda"
                        value={ctrl.getCurrencyLabel(ctrl.transaction.moeda)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Card de Cliente */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <InfoField
                        icon={User}
                        label="Nome"
                        value={ctrl.transaction.customer?.name || "N/A"}
                      />
                      <InfoField
                        label="Email"
                        value={ctrl.transaction.customer?.email || "N/A"}
                      />
                      <InfoField
                        label="ID do Cliente"
                        value={ctrl.transaction.customer_id}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Card de Datas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Datas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoField
                        icon={Calendar}
                        label="Data de Vencimento"
                        value={ctrl.formatDate(ctrl.transaction.expired_at)}
                      />
                      
                      <InfoField
                        icon={Calendar}
                        label="Data de Pagamento"
                        value={ctrl.formatDate(ctrl.transaction.payed_at)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                      <InfoField
                        icon={Calendar}
                        label="Data de Criação"
                        value={ctrl.formatDate(ctrl.transaction.created_at)}
                      />
                      
                      <InfoField
                        icon={Calendar}
                        label="Última Atualização"
                        value={ctrl.formatDate(ctrl.transaction.updated_at)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Card do Criador */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Criado por</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <InfoField
                        icon={User}
                        label="Nome de usuário"
                        value={ctrl.transaction.creator?.user_name || "N/A"}
                      />
                      <InfoField
                        label="Email"
                        value={ctrl.transaction.creator?.email || "N/A"}
                      />
                      <InfoField
                        label="ID do Criador"
                        value={ctrl.transaction.created_by}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Card de Observações */}
                {ctrl.transaction.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Observações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <label className="text-sm font-medium text-muted-foreground">Notas</label>
                        </div>
                        <p className="text-base whitespace-pre-wrap">{ctrl.transaction.notes}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </ViewFormProvider>
        </div>
      </div>

      {/* Botões de Ação no Footer */}
      <div className="gap-3 border-t border-border bg-muted px-3">
        <div className="max-w-4xl justify-between flex h-14 items-center">
          <Button variant="outline" onClick={ctrl.handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={ctrl.handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar Transação
          </Button>
        </div>
      </div>
    </div>
  );
}

