"use client";

import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCustomersListingPageFiltersCtrl } from "./customers-listing-page-filters.ctrl";
import { CustomersListingPageFiltersProps } from "./customers-listing-page-filters.types";
import { FiltersContainer } from "@/components/filters-container/filters-container";

/**
 * Componente principal de filtros para Clientes
 */
export function CustomersListingPageFilters(props: CustomersListingPageFiltersProps) {
  const ctrl = useCustomersListingPageFiltersCtrl(props);

  return (
    <FiltersContainer
      visible={props.isVisibleMobile}
      onRequestClose={props.onRequestClose}
      onSubmit={() => {
        props.onRequestClose?.();
        props.onFiltersApply(ctrl.methods.getValues());
      }}
      title="Filtros de Clientes"
      submitButtonText="Aplicar Filtros"
      className="mb-6"
    >
      <div className="bg-background-transparent md:bg-background-muted rounded-lg md:mb-6 md:p-6">
        <FormProvider {...ctrl.methods}>
          <form
            onSubmit={ctrl.handleSubmit(ctrl.onSubmit)}
            className="md:grid xl:grid-cols-4 lg:grid-cols-3 gap-4 space-y-4 md:space-y-0 md:grid-cols-2 grid-cols-1"
          >
            {/* Campo de busca geral */}
            <Input
              name="search"
              title="Buscar"
              placeholder="Buscar por nome, email..."
            />

            {/* Campo de tipo de pessoa */}
            <Select
              name="person_type"
              title="Tipo de Pessoa"
              options={[
                { value: "all", label: "Todos" },
                { value: "PF", label: "Pessoa Física" },
                { value: "PJ", label: "Pessoa Jurídica" },
              ]}
            />

            {/* Campo de nome */}
            <Input
              name="name"
              title="Nome"
              placeholder="Filtrar por nome..."
            />

            {/* Campo de email */}
            <Input
              name="email"
              title="Email"
              placeholder="Filtrar por email..."
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