import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  filterSchema,
  ILogsListingPageFilters,
  LogsListingPageFiltersProps,
} from "./logs-listing-page-filters.types";
import { useIsMobile } from "@/hooks/use-mobile";
import { usersApi } from "@/api/users.request";

/**
 * Hook controller para o componente de filtros de Logs Listing Page
 * Gerencia toda a lógica do formulário e estado dos filtros
 */
export function useLogsListingPageFiltersCtrl(props: LogsListingPageFiltersProps) {
  const { onFiltersApply, filters } = props;
  const isMobile = useIsMobile();
  const [users, setUsers] = useState<Array<{ value: string; label: string }>>([]);

  // Configuração do formulário com react-hook-form
  const methods = useForm<ILogsListingPageFilters>({
    resolver: zodResolver(filterSchema),
    defaultValues: filters,
  });

  useEffect(() => {
    methods.reset(filters);
  }, [filters, methods]);

  // Carregar usuários para o select
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await usersApi.all();
        const userOptions = allUsers.map((user) => ({
          value: String(user.id),
          label: user.user_name || user.email,
        }));
        setUsers(userOptions);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    };

    loadUsers();
  }, []);

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
  const onSubmit = async (data: ILogsListingPageFilters) => {
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

    // Dados
    users,

    // Funções de controle
    onSubmit,
    resetForm,
  };
}

