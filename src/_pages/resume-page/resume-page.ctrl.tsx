"use client";

import {
  useView,
} from "@devesharp/react-hooks-v2";
import { resumeApi, FinancialData } from "@/api/resume.request";
import { useRouter } from "next/navigation";

export function ResumePageCtrl() {
  const router = useRouter();

  const view = useView({
    resolves: {
      financial: resumeApi.financial,
    },
  });

  const goToTransactions = () => {
    router.push('/transactions');
  };

  const goToCustomers = () => {
    router.push('/customers');
  };

  return {
    view,
    financial: view.resolvesResponse.financial as FinancialData,
    goToTransactions,
    goToCustomers,
  };
}
