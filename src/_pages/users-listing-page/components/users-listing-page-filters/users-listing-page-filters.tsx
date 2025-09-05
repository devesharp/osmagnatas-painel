"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useUsersListingPageFiltersCtrl } from "./users-listing-page-filters.ctrl";
import { UsersListingPageFiltersProps } from "./users-listing-page-filters.types";
import { FiltersContainer } from "@/components/filters-container/filters-container";
import { ViewFormProvider } from "@devesharp/react-hooks-v2";

/**
 * Componente principal de filtros para Usuários
 */
export function UsersListingPageFilters(props: UsersListingPageFiltersProps) {
  const ctrl = useUsersListingPageFiltersCtrl(props);

  return (
    <FiltersContainer
      visible={props.isVisibleMobile}
      onRequestClose={props.onRequestClose}
      onSubmit={ctrl.onSubmit}
      title="Filtros de Usuários"
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
            {/* Campo de busca geral */}
            <Input
              name="search"
              title="Busca Geral"
              placeholder="Buscar por nome, email ou CRECI..."
            />

            {/* Nome de usuário */}
            <Input
              name="user_name"
              title="Nome de Usuário"
              placeholder="Digite o nome de usuário..."
            />

            {/* Email */}
            <Input
              name="email"
              title="Email"
              placeholder="Digite o email..."
            />

            {/* Status */}
            <Select
              name="ativo"
              title="Status"
              options={[
                { value: "all", label: "Todos" },
                { value: "true", label: "Ativo" },
                { value: "false", label: "Inativo" },
              ]}
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