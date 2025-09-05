import { useEffect } from "react";
import {
  IUsersListingPageFilters,
  UsersListingPageFiltersProps,
} from "./users-listing-page-filters.types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useViewForm } from "@devesharp/react-hooks-v2";
import omitBy from "lodash/omitBy";
import isNil from "lodash/isNil";

/**
 * Hook controller para o componente de filtros de Users Listing Page
 * Gerencia toda a lógica do formulário e estado dos filtros
 */
export function useUsersListingPageFiltersCtrl(
  props: UsersListingPageFiltersProps
) {
  const { onFiltersApply, filters } = props;
  const isMobile = useIsMobile();

  const viewForm = useViewForm({
    initialData: {
      ativo: "all",
    },
    handleFormData: (data: unknown) => {
      const newData: Record<string, unknown> = {
        ...(data as Record<string, unknown>),
      };

      if ((data as { ativo: string }).ativo == "true") {
        newData.ativo = true;
      } else if ((data as { ativo: string }).ativo == "false") {
        newData.ativo = false;
      } else {
        newData.ativo = undefined;
      }

      return newData;
    },
  });

  console.log(viewForm.resource);
  useEffect(() => {
    viewForm.setResource({
      ativo: "all",
      ...omitBy(filters, isNil),
    });
  }, [filters]);

  /**
   * Função chamada ao submeter o formulário
   * Processa os dados e chama o callback de aplicação de filtros
   */
  const onSubmit = async () => {
    props.onRequestClose?.();
    onFiltersApply(viewForm.getData(true) as IUsersListingPageFilters);
  };

  /**
   * Função para resetar todos os campos do formulário
   * Limpa todos os valores e chama o callback de reset
   */
  const resetForm = () => {
    viewForm.setResource({});
  };

  return {
    // Métodos do formulário
    viewForm,

    // Funções de controle
    onSubmit,
    resetForm,
  };
}
