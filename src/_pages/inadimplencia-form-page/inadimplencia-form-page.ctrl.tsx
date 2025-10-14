"use client";

import { useViewForm, zodWrapper } from "@devesharp/react-hooks-v2";
import { toast } from "sonner";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { IInadimplenciaFormPageForm, InadimplenciaFormItem } from "./inadimplencia-form-page.types";
import { inadimplenciaApi } from "@/api/inadimplencia.request";
import { customersApi } from "@/api/customers.request";

// API para o formulário de inadimplências
const inadimplenciaFormApi = {
  getById: async (id: number): Promise<InadimplenciaFormItem> => {
    return await inadimplenciaApi.getById(id);
  },
  create: async (data: Partial<InadimplenciaFormItem>): Promise<InadimplenciaFormItem> => {
    return await inadimplenciaApi.create(data as any);
  },
  update: async (id: number, data: Partial<InadimplenciaFormItem>): Promise<InadimplenciaFormItem> => {
    return await inadimplenciaApi.update(id, data as any);
  },
};

export function InadimplenciaFormPageCtrl() {
  const { id } = useParams();
  const router = useRouter();

  const viewForm = useViewForm<IInadimplenciaFormPageForm>({
    id: id as string,
    resolves: {
      customers: customersApi.all,
    },
    initialData: {
      payed: false,
    },
    resolveGet: (id) => inadimplenciaFormApi.getById(Number(id)),
    resolveCreate: (data) => inadimplenciaFormApi.create(data),
    resolveUpdate: (id, data) => inadimplenciaFormApi.update(Number(id), data),
    validateData: zodWrapper(
      z.object({
        customer_id: z.string().min(1, "Cliente é obrigatório"),
        amount: z.number().min(0.01, "Valor deve ser maior que zero"),
        payed: z.boolean(),
        grams: z.number().int().min(0, "Gramas deve ser um número inteiro positivo").optional(),
        notes: z.string().optional(),
      })
    ),
    handleFormData: (data) => {
      return {
        ...data,
      };
    },
    onStarted: (v) => {
      if (!id && v.create) {
        // Aplicar valores padrão para nova inadimplência
        setTimeout(() => {
          viewForm.setValues(ctrl.defaultValues);
        }, 0);
      }
    },
    onSuccess: (data) => {
      const isEditing = !!id;
      toast.success(
        isEditing
          ? "Inadimplência atualizada com sucesso!"
          : "Inadimplência criada com sucesso!"
      );

      // Redirecionar para a listagem após salvar
      router.push('/inadimplencia/listing');
    },
    onFailed: (error) => {
      console.error("Erro ao salvar inadimplência:", error);
      toast.error("Erro ao salvar inadimplência. Tente novamente.");
    },
  });

  // Valores padrão para nova inadimplência
  const defaultValues: Partial<IInadimplenciaFormPageForm> = {
    payed: false,
    amount: 0,
  };

  return {
    viewForm,
    customers: viewForm.resolvesResponse.customers ?? [],
    isEditing: !!id,
    defaultValues,
  };
} 