"use client";

import { useViewForm, zodWrapper } from "@devesharp/react-hooks-v2";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ICustomersFormPageForm, CustomerItem } from "./customers-form-page.types";
import { customersApi } from "@/api/customers.request";

export function CustomersFormPageCtrl() {
  const { id } = useParams();
  const router = useRouter();
  
  const viewForm = useViewForm<ICustomersFormPageForm>({
    id: id as string,
    resolveGet: (id) => customersApi.getById(Number(id)),
    initialData: {
      person_type: 'PF',
    },
    resolveCreate: (data) => customersApi.create(data),
    resolveUpdate: (id, data) => customersApi.update(Number(id), data),
    validateData: zodWrapper(
      z.object({
        name: z.string().min(1, "Nome é obrigatório"),
        person_type: z.enum(['PF', 'PJ'], { required_error: "Tipo de pessoa é obrigatório" }),
        email: z.string().email("E-mail inválido").optional(),
        phone: z.string().optional(),
        cpf: z.string().optional(),
        cnpj: z.string().optional(),
        wallet_address: z.string().optional(),
        access_website: z.string().optional(),
        access_email: z.string().optional(),
        access_password: z.string().optional(),
      })
    ),
    onSuccess: () => {
      toast.success(id ? "Cliente atualizado com sucesso" : "Cliente criado com sucesso");
      // Redirecionar para a listagem após salvar
      router.push('/customers');
    },
    onFailed: (error) => {
      console.error(error);
      toast.error("Erro ao salvar cliente");
    },
  });

  console.log(viewForm.errors)

  return {
    viewForm,
  };
} 