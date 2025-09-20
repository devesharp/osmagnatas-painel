"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { customersApi } from "@/api/customers.request";

// Interface para os dados do resumo do cliente (compatível com Customer)
interface CustomerResumeData {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  person_type: 'PF' | 'PJ';
  cpf?: string | null;
  cnpj?: string | null;
  wallet_address?: string | null;
  access_website?: string | null;
  access_email?: string | null;
  access_password?: string | null;
  created_by: number;
  createdAt: Date;
  updatedAt: Date;
  creator?: {
    id: number;
    email: string;
    user_name?: string | null;
  };
}


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
      const data = await customersApi.getResume(customerId);
      setCustomer(data as CustomerResumeData);
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