"use client";

import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useLogsListingPageFiltersCtrl } from "./logs-listing-page-filters.ctrl";
import { LogsListingPageFiltersProps } from "./logs-listing-page-filters.types";
import { FiltersContainer } from "@/components/filters-container/filters-container";

/**
 * Componente principal de filtros para Logs Listing Page
 */
export function LogsListingPageFilters(props: LogsListingPageFiltersProps) {
  const ctrl = useLogsListingPageFiltersCtrl(props);

  // Opções para o select de ações
  const actionOptions = [
    { value: "-", label: "Todas as ações" },
    { value: "LOGIN", label: "Login" },
    { value: "LOGOUT", label: "Logout" },
    { value: "CREATE_TRANSACTION", label: "Criar Transação" },
    { value: "UPDATE_TRANSACTION", label: "Atualizar Transação" },
    { value: "DELETE_TRANSACTION", label: "Excluir Transação" },
    { value: "CREATE_CUSTOMER", label: "Criar Cliente" },
    { value: "UPDATE_CUSTOMER", label: "Atualizar Cliente" },
    { value: "DELETE_CUSTOMER", label: "Excluir Cliente" },
    { value: "VIEW_TRANSACTION", label: "Visualizar Transação" },
    { value: "VIEW_CUSTOMER", label: "Visualizar Cliente" },
    { value: "CREATE_INADIMPLENCIA", label: "Criar Inadimplência" },
    { value: "UPDATE_INADIMPLENCIA", label: "Atualizar Inadimplência" },
    { value: "DELETE_INADIMPLENCIA", label: "Excluir Inadimplência" },
    { value: "VIEW_INADIMPLENCIA", label: "Visualizar Inadimplência" },
  ];

  return (
    <FiltersContainer
      visible={props.isVisibleMobile}
      onRequestClose={props.onRequestClose}
      onSubmit={() => {
        props.onRequestClose?.();
        props.onFiltersApply(ctrl.methods.getValues());
      }}
      title="Filtros de Logs do Sistema"
      submitButtonText="Aplicar Filtros"
      className="mb-6"
    >
      <div className="bg-background-transparent md:bg-background-muted rounded-lg md:mb-6 md:p-6">
        <FormProvider {...ctrl.methods}>
          <form
            onSubmit={ctrl.handleSubmit(ctrl.onSubmit)}
            className="md:grid xl:grid-cols-4 lg:grid-cols-3 gap-4 space-y-4 md:space-y-0 md:grid-cols-2 grid-cols-1"
          >
            {/* Campo de seleção de usuário */}
            <Select
              name="user_id"
              title="Usuário"
              options={[{ value: "-", label: "Todos os usuários" }, ...ctrl.users]}
            />

            {/* Campo de seleção de ação */}
            <Select
              name="log_type"
              title="Ação"
              options={actionOptions}
            />

            {/* Campo de data inicial */}
            <Input
              name="date_from"
              title="Data Inicial"
              placeholder="DD/MM/AAAA"
              mask="date"
            />

            {/* Campo de data final */}
            <Input
              name="date_to"
              title="Data Final"
              placeholder="DD/MM/AAAA"
              mask="date"
            />

            {/* Botões de ação */}
            <div className="gap-2 pt-0 col-span-full hidden md:flex">
              <Button
                type="submit"
                disabled={ctrl.isSubmitting}
                className="flex-1"
                size="lg"
              >
                {ctrl.isSubmitting ? "Aplicando..." : "Buscar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={ctrl.resetForm}
                size="lg"
              >
                Limpar
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </FiltersContainer>
  );
}

