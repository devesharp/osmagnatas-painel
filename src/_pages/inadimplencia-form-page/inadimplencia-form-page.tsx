"use client";

import { Button } from "@/components/ui/button";
import { InadimplenciaFormPageCtrl } from "./inadimplencia-form-page.ctrl";
import { ViewFormProvider } from "@devesharp/react-hooks-v2";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { LoadingForeground } from "@/components/loading-foreground";
import { InputPrice } from "@/components/ui/input-price";

export function InadimplenciaFormPage() {
  const ctrl = InadimplenciaFormPageCtrl();

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
                  {ctrl.isEditing ? "Editar Inadimplência" : "Nova Inadimplência"}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {ctrl.isEditing
                    ? "Atualize as informações da inadimplência"
                    : "Preencha os dados para criar uma nova inadimplência"
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <InputPrice
                    name="amount"
                    title="Valor *"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
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
                    placeholder="Digite observações sobre a inadimplência..."
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