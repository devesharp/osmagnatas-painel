"use client";

import { Button } from "@/components/ui/button";
import { TransactionsFormPageCtrl } from "./transactions-form-page.ctrl";
import { ViewFormProvider } from "@devesharp/react-hooks-v2";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingForeground } from "@/components/loading-foreground";
import { Select } from "@/components/ui/select";
import { PaymentType } from "@/types/transaction";
import { InputPrice } from "@/components/ui/input-price";

// Componente auxiliar para campos de data
function DateField({ name, title, placeholder }: { name: string; title: string; placeholder?: string }) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{title}</label>
      <Input
        name={name}
        type="date"
        placeholder={placeholder || "Selecione uma data"}
      />
    </div>
  );
}

export function TransactionsFormPage() {
  const ctrl = TransactionsFormPageCtrl();

  return (
    <div className="w-full flex flex-col h-full relative">
      <LoadingForeground
        visible={ctrl.viewForm.isLoading || ctrl.viewForm.isSaving}
      />
      <div className="w-full flex-1 overflow-y-auto p-5">
        {/* Header */}
        <div className="pb-8">
          <div className="mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold">
                  {ctrl.isEditing ? "Editar Transação" : "Nova Transação"}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {ctrl.isEditing
                    ? "Atualize as informações da transação"
                    : "Preencha os dados para criar uma nova transação"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl">
          <ViewFormProvider {...ctrl.viewForm}>
            <div className="space-y-8">
              {/* Informações Básicas */}
              <div className="">
                <h2 className="font-semibold mb-4 border-b pb-2">
                  Informações Básicas
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    name="customer_id"
                    title="Cliente *"
                    type="number"
                    options={ctrl.customers.map((customer) => ({ value: customer.id.toString(), label: customer.name }))}
                  />

                  <Select
                    name="status"
                    title="Status *"
                    placeholder="Selecione o status"
                    options={[
                      { value: "PENDING", label: "Pendente" },
                      { value: "CANCELED", label: "Cancelado" },
                      { value: "PAYED", label: "Pago" },
                    ]}
                  />

                  <Select
                    name="payment_type"
                    title="Tipo de Pagamento *"
                    placeholder="Selecione o tipo"
                    options={[
                      { value: "IN", label: "Entrada (Recebimento)" },
                      { value: "OUT", label: "Saída (Pagamento)" },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <InputPrice
                    name="amount"
                    title="Valor *"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                  />

                  <Select
                    name="moeda"
                    title="Moeda *"
                    placeholder="Selecione a moeda"
                    options={[
                      { value: "BRL", label: "Real (BRL)" },
                      // { value: "USD", label: "Dólar (USD)" },
                      // { value: "EUR", label: "Euro (EUR)" },
                    ]}
                  />
                </div>
              </div>

              {/* Datas */}
              <div className="">
                <h2 className="font-semibold mb-4 border-b pb-2">
                  Datas
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DateField
                    name="expired_at"
                    title="Data de Vencimento"
                    placeholder="Selecione a data de vencimento"
                  />

                  <DateField
                    name="payed_at"
                    title="Data de Pagamento"
                    placeholder="Selecione a data de pagamento"
                  />
                </div>
              </div>

              {/* Observações */}
              <div className="">
                <h2 className="font-semibold mb-4 border-b pb-2">
                  Observações
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  <Textarea
                    name="notes"
                    title="Notas"
                    placeholder="Digite observações sobre a transação..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </ViewFormProvider>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="gap-3 border-t border-border bg-muted px-3">
        <div className="max-w-4xl justify-between flex h-14 items-center">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => ctrl.viewForm.submitForm()}
            disabled={ctrl.viewForm.isSaving}
          >
            {ctrl.viewForm.isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </div>
  );
} 