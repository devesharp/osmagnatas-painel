import { useEffect, useState } from "react";
import {
  ILogsListingPageFilters,
  LogsListingPageFiltersProps,
} from "./logs-listing-page-filters.types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useViewForm } from "@devesharp/react-hooks-v2";
import { usersApi } from "@/api/users.request";

/**
 * Hook controller para o componente de filtros de Logs Listing Page
 * Gerencia toda a lógica do formulário e estado dos filtros
 */
export function useLogsListingPageFiltersCtrl(props: LogsListingPageFiltersProps) {
  const { onFiltersApply, filters } = props;
  const isMobile = useIsMobile();
  const [users, setUsers] = useState<Array<{ value: string; label: string }>>([]);

  const viewForm = useViewForm({});

  useEffect(() => {
    viewForm.setResource(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

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
    
    // Dados
    users,

    // Funções de controle
    onSubmit,
    resetForm,
  };
}

