"use client";

import { useViewForm, zodWrapper } from "@devesharp/react-hooks-v2";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ITransactionsFormPageForm, TransactionsFormItem } from "./transactions-form-page.types";
import { transactionsApi } from "@/api/transactions.request";
import { TransactionStatus, PaymentType } from "@/types/transaction";
import { customersApi } from "@/api/customers.request";

// API para o formulário de transactions
const transactionsFormApi = {
  getById: async (id: number): Promise<TransactionsFormItem> => {
    return await transactionsApi.getById(id);
  },
  create: async (data: Partial<TransactionsFormItem>): Promise<TransactionsFormItem> => {
    return await transactionsApi.create(data as any);
  },
  update: async (id: number, data: Partial<TransactionsFormItem>): Promise<TransactionsFormItem> => {
    return await transactionsApi.update(id, data as any);
  },
};

export function TransactionsFormPageCtrl() {
  const { id } = useParams();
  const router = useRouter();

  const viewForm = useViewForm<ITransactionsFormPageForm>({
    id: id as string,
    resolves: {
      customers: customersApi.all,
    },
    initialData: {
      status: 'PENDING',
      payment_type: 'IN',
      moeda: 'BRL',
    },
    resolveGet: (id) => transactionsFormApi.getById(Number(id)),
    resolveCreate: (data) => transactionsFormApi.create(data),
    resolveUpdate: (id, data) => transactionsFormApi.update(Number(id), data),
    validateData: zodWrapper(
      z.object({
        customer_id: z.string().min(1, "Cliente é obrigatório"),
        status: z.enum(['PENDING', 'CANCELED', 'PAYED'], {
          errorMap: () => ({ message: "Status inválido" })
        }),
        payment_type: z.enum(['IN', 'OUT'], {
          errorMap: () => ({ message: "Tipo de pagamento inválido" })
        }),
        amount: z.number().min(0.01, "Valor deve ser maior que zero"),
        moeda: z.string().min(1, "Moeda é obrigatória"),
        notes: z.string().optional(),
        expired_at: z.string().optional(),
        payed_at: z.string().optional(),
      })
    ),
    handleFormData: (data) => {
      // Converter datas para formato ISO string se existirem
      return {
        ...data,
      };
    },
    onStarted: (v) => {
      // Converter datas string para Date objects se necessário
      if (v.get) {
        const item = v.get;
        if (item.expired_at && typeof item.expired_at === 'string') {
          item.expired_at = new Date(item.expired_at);
        }
        if (item.payed_at && typeof item.payed_at === 'string') {
          item.payed_at = new Date(item.payed_at);
        }
      } else if (!id) {
        // Aplicar valores padrão para nova transação
        setTimeout(() => {
          viewForm.setValues(ctrl.defaultValues);
        }, 0);
      }
    },
    onSuccess: (data) => {
      const isEditing = !!id;
      toast.success(
        isEditing
          ? "Transação atualizada com sucesso!"
          : "Transação criada com sucesso!"
      );

      // Redirecionar para a listagem após salvar
      router.push('/transactions');
    },
    onFailed: (error) => {
      console.error("Erro ao salvar transação:", error);
      toast.error("Erro ao salvar transação. Tente novamente.");
    },
  });

  // Valores padrão para nova transação
  const defaultValues: Partial<ITransactionsFormPageForm> = {
    status: 'PENDING',
    payment_type: 'OUT',
    moeda: 'BRL',
    amount: 0,
  };

  return {
    viewForm,
    customers: viewForm.resolvesResponse.customers ?? [],
    isEditing: !!id,
    defaultValues,
  };
} 