"use client";

import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useTransactionsListingPageFiltersCtrl } from "./transactions-listing-page-filters.ctrl";
import { TransactionsListingPageFiltersProps } from "./transactions-listing-page-filters.types";
import { FiltersContainer } from "@/components/filters-container/filters-container";

/**
 * Componente principal de filtros para Transactions Listing Page
 */
export function TransactionsListingPageFilters(props: TransactionsListingPageFiltersProps) {
  const ctrl = useTransactionsListingPageFiltersCtrl(props);

  return (
    <FiltersContainer
      visible={props.isVisibleMobile}
      onRequestClose={props.onRequestClose}
      onSubmit={() => {
        props.onRequestClose?.();
        props.onFiltersApply(ctrl.methods.getValues());
      }}
      title="Filtros de Transactions Listing Page"
      submitButtonText="Aplicar Filtros"
      className="mb-6"
    >
      <div className="bg-background-transparent md:bg-background-muted rounded-lg md:mb-6 md:p-6">
        <FormProvider {...ctrl.methods}>
          <form
            onSubmit={ctrl.handleSubmit(ctrl.onSubmit)}
            className="md:grid xl:grid-cols-4 lg:grid-cols-3 gap-4 space-y-4 md:space-y-0 md:grid-cols-2 grid-cols-1"
          >
            {/* Campo de busca básico */}
            <Input
              name="search"
              title="Buscar"
              placeholder="Digite para buscar..."
            />

            {/* Campo de seleção de status */}
            <Select
              name="status"
              title="Status"
              options={[
                { value: "all", label: "Todos" },
                { value: "PENDING", label: "Pendente" },
                { value: "CANCELED", label: "Cancelado" },
                { value: "PAYED", label: "Pago" },
              ]}
            />

            {/* Campo de seleção de tipo de pagamento */}
            <Select
              name="payment_type"
              title="Tipo de Pagamento"
              options={[
                { value: "all", label: "Todos" },
                { value: "IN", label: "Entrada" },
                { value: "OUT", label: "Saída" },
              ]}
            />

            {/* TODO: Adicionar mais campos de filtro conforme necessário */}

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