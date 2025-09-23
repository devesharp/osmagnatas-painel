"use client";

import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useInadimplenciaListingPageFiltersCtrl } from "./inadimplencia-listing-page-filters.ctrl";
import { InadimplenciaListingPageFiltersProps } from "./inadimplencia-listing-page-filters.types";
import { FiltersContainer } from "@/components/filters-container/filters-container";

/**
 * Componente principal de filtros para Inadimplencia Listing Page
 */
export function InadimplenciaListingPageFilters(props: InadimplenciaListingPageFiltersProps) {
  const ctrl = useInadimplenciaListingPageFiltersCtrl(props);

  return (
    <FiltersContainer
      visible={props.isVisibleMobile}
      onRequestClose={props.onRequestClose}
      onSubmit={() => {
        props.onRequestClose?.();
        props.onFiltersApply(ctrl.methods.getValues());
      }}
      title="Filtros de Inadimplências Pendentes"
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
              placeholder="Buscar inadimplências pendentes..."
            />

            {/* Campo de status de pagamento - oculto (sempre filtra por pendente) */}
            <input
              type="hidden"
              name="payed"
              value="false"
            />

            {/* Campo de valor mínimo */}
            <Input
              name="amount_min"
              title="Valor Mínimo"
              placeholder="0.00"
              type="number"
              step="0.01"
            />

            {/* Campo de valor máximo */}
            <Input
              name="amount_max"
              title="Valor Máximo"
              placeholder="999999.99"
              type="number"
              step="0.01"
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