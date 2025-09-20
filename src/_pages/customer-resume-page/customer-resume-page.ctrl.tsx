"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Interface para os dados do resumo do cliente
interface CustomerResumeData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  person_type: 'PF' | 'PJ';
  cpf?: string;
  cnpj?: string;
  wallet_address?: string;
  access_website?: string;
  access_email?: string;
  created_at: string;
  updated_at: string;
  creator?: {
    id: number;
    email: string;
    user_name: string;
  };
}

// API para buscar dados do resumo do cliente
const customerResumeApi = {
  get: async (id: number): Promise<CustomerResumeData> => {
    const response = await fetch(`/api/customers/${id}/resume`);
    if (!response.ok) {
      throw new Error('Erro ao buscar dados do cliente');
    }
    const result = await response.json();
    return result.data;
  },
};

export function CustomerResumePageCtrl() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<CustomerResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Extrair ID do cliente da URL
  const getCustomerId = (): number | null => {
    if (typeof window === 'undefined') return null;

    const path = window.location.pathname;
    const match = path.match(/\/customers\/(\d+)\/resume/);
    return match ? parseInt(match[1], 10) : null;
  };

  // Buscar dados do cliente
  const fetchCustomerData = async () => {
    const customerId = getCustomerId();
    if (!customerId) {
      setError('ID do cliente não encontrado na URL');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await customerResumeApi.get(customerId);
      setCustomer(data);
    } catch (err) {
      console.error('Erro ao buscar dados do cliente:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      toast.error('Erro ao carregar dados do cliente');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  // Função para voltar à lista de clientes
  const goToCustomers = () => {
    router.push('/customers/listing');
  };

  return {
    loading,
    customer,
    error,
    goToCustomers,
    refreshData: fetchCustomerData,
  };
} 