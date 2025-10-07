"use client";

import { Button } from "@/components/ui/button";
import { CustomersFormPageCtrl } from "./customers-form-page.ctrl";
import { ViewFormProvider } from "@devesharp/react-hooks-v2";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { LoadingForeground } from "@/components/loading-foreground";
import { useParams } from "next/navigation";

export function CustomersFormPage() {
  const ctrl = CustomersFormPageCtrl();
  const { id } = useParams();
  const isEditing = !!id;

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
                  {isEditing ? "Editar Cliente" : "Novo Cliente"}
                </h1>
                <p className="text-muted-foreground">
                  {isEditing ? "Edite as informações do cliente" : "Preencha os dados para cadastrar um novo cliente"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl">
          <ViewFormProvider {...ctrl.viewForm}>
            <div className="space-y-8">
              {/* Seção Dados Principais */}
              <div className="">
                <h2 className="font-semibold mb-4 border-b pb-2">
                  Dados Principais
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    name="name"
                    title="Nome Completo *"
                    
                  />

                  <Select
                    name="person_type"
                    title="Tipo de Pessoa *"
                    options={[
                      { value: "PF", label: "Pessoa Física" },
                      { value: "PJ", label: "Pessoa Jurídica" },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    name="email"
                    title="E-mail *"
                    type="email"
                    mask="login"
                    
                  />

                  <Input
                    name="phone"
                    title="Telefone"
                    mask="phone"
                    
                  />
                </div>
              </div>

              {/* Seção Documentos */}
              <div className="">
                <h2 className="font-semibold mb-4 border-b pb-2">
                  Documentos
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="cpf"
                    title="CPF"
                    mask="cpf"
                    
                  />

                  <Input
                    name="cnpj"
                    title="CNPJ"
                    mask="cnpj"
                    
                  />
                </div>
              </div>

              {/* Seção Acesso */}
              <div className="">
                <h2 className="font-semibold mb-4 border-b pb-2">
                  Informações de Acesso
                </h2>

                <div className="grid grid-cols-1 gap-4 mb-4">
                  <Input
                    name="wallet_address"
                    title="Carteira Digital"
                    
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    name="access_website"
                    title="Website de Acesso"
                    type="url"
                    
                  />

                  <Input
                    name="access_email"
                    title="E-mail de Acesso"
                    type="email"
                    
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="access_password"
                    title="Senha de Acesso"
                  />
                </div>
              </div>
            </div>
          </ViewFormProvider>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="gap-3 border-t border-border bg-muted px-3">
        <div className="max-w-6xl justify-end flex h-14 items-center">
          <Button onClick={() => ctrl.viewForm.submitForm()}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
} 