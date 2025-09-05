import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  filterSchema,
  ICustomersListingPageFilters,
  CustomersListingPageFiltersProps,
} from "./customers-listing-page-filters.types";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Hook controller para o componente de filtros de Clientes
 * Gerencia toda a lógica do formulário e estado dos filtros
 */
export function useCustomersListingPageFiltersCtrl(props: CustomersListingPageFiltersProps) {
  const { onFiltersApply, filters } = props;
  const isMobile = useIsMobile();

  // Configuração do formulário com react-hook-form
  const methods = useForm<ICustomersListingPageFilters>({
    resolver: zodResolver(filterSchema),
    defaultValues: filters,
  });

  useEffect(() => {
    methods.reset(filters);
  }, [filters, methods]);

  // Desestruturação dos métodos do formulário
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  /**
   * Função chamada ao submeter o formulário
   * Processa os dados e chama o callback de aplicação de filtros
   */
  const onSubmit = async (data: ICustomersListingPageFilters) => {
    try {
      if (!isMobile) {
        console.log("Dados do formulário:", data);
        onFiltersApply(data);
      }
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
    }
  };

  /**
   * Função para resetar todos os campos do formulário
   * Limpa todos os valores e chama o callback de reset
   */
  const resetForm = () => {
    reset({});
  };

  return {
    // Métodos do formulário
    methods,
    handleSubmit,
    setValue,
    isSubmitting,

    // Funções de controle
    onSubmit,
    resetForm,
  };
} 