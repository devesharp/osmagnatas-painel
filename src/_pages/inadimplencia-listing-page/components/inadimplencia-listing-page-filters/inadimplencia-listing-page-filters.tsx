"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputDate } from "@/components/ui/input-date";
import { useInadimplenciaListingPageFiltersCtrl } from "./inadimplencia-listing-page-filters.ctrl";
import { InadimplenciaListingPageFiltersProps } from "./inadimplencia-listing-page-filters.types";
import { FiltersContainer } from "@/components/filters-container/filters-container";
import { ViewFormProvider } from "@devesharp/react-hooks-v2";

/**
 * Componente principal de filtros para Inadimplencia Listing Page
 */
export function InadimplenciaListingPageFilters(props: InadimplenciaListingPageFiltersProps) {
  const ctrl = useInadimplenciaListingPageFiltersCtrl(props);

  return (
    <FiltersContainer
      visible={props.isVisibleMobile}
      onRequestClose={props.onRequestClose}
      onSubmit={ctrl.onSubmit}
      title="Filtros de Inadimplências Pendentes"
      submitButtonText="Aplicar Filtros"
      className="mb-6"
    >
      <div className="bg-background-transparent md:bg-background-muted rounded-lg md:mb-6 md:p-6">
        <ViewFormProvider {...ctrl.viewForm}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ctrl.onSubmit();
            }}
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

            {/* Campo de gramas mínimo */}
            <Input
              name="grams_min"
              title="Gramas Mínimo"
              placeholder="0"
              type="number"
              min="0"
            />

            {/* Campo de gramas máximo */}
            <Input
              name="grams_max"
              title="Gramas Máximo"
              placeholder="999999"
              type="number"
              min="0"
            />

            {/* Filtros de Data de Criação */}
            <InputDate
              name="created_at_start"
              title="Criação - De"
              placeholder="dd/MM/yyyy"
            />

            <InputDate
              name="created_at_end"
              title="Criação - Até"
              placeholder="dd/MM/yyyy"
            />

            {/* Botões de ação */}
            <div className="gap-2 pt-0 col-span-full hidden md:flex">
              <Button
                type="submit"
                className="flex-1"
                size="lg"
              >
                Buscar
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
        </ViewFormProvider>
      </div>
    </FiltersContainer>
  );
} 