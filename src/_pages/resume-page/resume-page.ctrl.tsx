"use client";

import { useState, useMemo, useEffect } from "react";
import { resumeApi, FinancialData } from "@/api/resume.request";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";

export function ResumePageCtrl() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 15),
    to: new Date(),
  });
  const [financial, setFinancial] = useState<FinancialData | null>(null);
  const [fixedFinancial, setFixedFinancial] = useState<FinancialData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Carregar dados financeiros fixos (sem filtro)
  useEffect(() => {
    const loadFixedFinancial = async () => {
      try {
        const data = await resumeApi.financial();
        setFixedFinancial(data);
      } catch (error) {
        console.error("Erro ao carregar dados fixos:", error);
      }
    };

    loadFixedFinancial();
  }, []);

  // Carregar dados financeiros filtrados por data
  useEffect(() => {
    const loadFinancial = async () => {
      try {
        setLoading(true);
        const data = await resumeApi.financial(dateRange);
        setFinancial(data);
      } catch (error) {
        console.error("Erro ao carregar dados filtrados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFinancial();
  }, [dateRange]);

  const goToTransactions = () => {
    router.push("/transactions");
  };

  const goToCustomers = () => {
    router.push("/customers");
  };

  // Função para formatar data para a API
  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // Calcular métricas baseadas no filtro de data
  const customMetrics = useMemo(() => {
    if (!financial || !dateRange?.from) {
      return {
        entradaPeriodo: 0,
        saidaPeriodo: 0,
        saldoPeriodo: 0,
      };
    }

    const entradaPeriodo = financial.entradaMes;
    const saidaPeriodo = financial.saidaMes;
    const saldoPeriodo = entradaPeriodo - saidaPeriodo;

    return {
      entradaPeriodo,
      saidaPeriodo,
      saldoPeriodo,
    };
  }, [financial, dateRange]);

  return {
    financial,
    fixedFinancial,
    dateRange,
    setDateRange,
    goToTransactions,
    goToCustomers,
    customMetrics,
    formatDateForAPI,
    loading,
  };
}
