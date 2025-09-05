"use client";

import { Button } from "@/components/ui/button";
import { UsersFormPageCtrl } from "./users-form-page.ctrl";
import { ViewFormProvider } from "@devesharp/react-hooks-v2";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingForeground } from "@/components/loading-foreground";
import { UsuarioImagem } from "@/components/usuario-imagem";

export function UsersFormPage() {
  const ctrl = UsersFormPageCtrl();

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
                  {ctrl.viewForm.isEditing ? "Editar Usuário" : "Criar Usuário"}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl">
          <ViewFormProvider {...ctrl.viewForm}>
            <div className="space-y-8">
              {/* Seção Dados Pessoais */}
              <div className="">
                <h2 className="font-semibold mb-4 border-b pb-2">
                  Dados Pessoais
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Switch name="ATIVO" title="Ativo" />
                  <Switch
                    name="CORRETOR.CORRETOR_PRINCIPAL"
                    title="É Corretor"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    name="CORRETOR.NOME"
                    title="Nome Corretor / Usuário"
                    mask="uppercase"
                  />
                  <Input
                    name="USER_NAME"
                    title="Login"
                    mask="login"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input name="EMAIL" title="E-mail" type="email" />
                  <Input name="CRECI" title="Nº Creci" />
                </div>
              </div>

              {/* Seção Contatos */}
              <div className="">
                <h2 className="font-semibold mb-4 border-b pb-2">Contatos</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    name="CELULAR_01"
                    title="Tel. Celular 1"
                    mask="phone"
                    placeholder="(00) 0000-0000"
                  />
                  <Input
                    name="CELULAR_02"
                    title="Tel. Celular 2"
                    mask="phone"
                    placeholder="(00) 0000-0000"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    name="TELEFONE_01"
                    title="Telefone 1"
                    mask="phone"
                    placeholder="(00) 0000-0000"
                  />
                  <Input
                    name="TELEFONE_02"
                    title="Telefone 2"
                    mask="phone"
                    placeholder="(00) 0000-0000"
                  />
                </div>
              </div>

              {/* Seção Acesso ao Sistema */}
              <div className="">
                <h2 className="font-semibold mb-4 border-b pb-2">
                  Acesso ao Sistema
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Switch
                    title="Habilitar acesso por qualquer IP"
                    name={"LIBERAR_QUALQUER_IP"}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Input
                      name="SENHA"
                      title="Senha"
                      type="password"
                      placeholder="Digite a senha"
                    />
                    {ctrl.viewForm.isEditing && (
                      <span className="text-sm text-red-500">
                        Só preencha esse campo se quiser alterar a senha.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ViewFormProvider>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="gap-3 border-t border-border bg-muted px-3">
        <div className="max-w-6xl justify-end flex h-14 items-center">
          <Button onClick={() => ctrl.viewForm.submitForm()}>Gravar</Button>
        </div>
      </div>
    </div>
  );
}
