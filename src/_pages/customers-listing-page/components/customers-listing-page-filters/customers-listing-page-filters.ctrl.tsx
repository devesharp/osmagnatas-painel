import { useEffect } from "react";
import {
  ICustomersListingPageFilters,
  CustomersListingPageFiltersProps,
} from "./customers-listing-page-filters.types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useViewForm } from "@devesharp/react-hooks-v2";

/**
 * Hook controller para o componente de filtros de Clientes
 * Gerencia toda a lógica do formulário e estado dos filtros
 */
export function useCustomersListingPageFiltersCtrl(props: CustomersListingPageFiltersProps) {
  const { onFiltersApply, filters } = props;
  const isMobile = useIsMobile();

  const viewForm = useViewForm({});

  useEffect(() => {
    viewForm.setResource(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  /**
   * Função chamada ao submeter o formulário
   * Processa os dados e chama o callback de aplicação de filtros
   */
  const onSubmit = async () => {
    props.onRequestClose?.();
    onFiltersApply(viewForm.resource);
  };

  /**
   * Função para resetar todos os campos do formulário
   * Limpa todos os valores e chama o callback de reset
   */
  const resetForm = () => {
    viewForm.setResource({});
    onFiltersApply({});
  };

  return {
    viewForm,
    
    // Funções de controle
    onSubmit,
    resetForm,
  };
} 