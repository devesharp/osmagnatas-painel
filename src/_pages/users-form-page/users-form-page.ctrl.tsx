"use client";

import { IResolve, useViewForm, zodWrapper } from "@devesharp/react-hooks-v2";
import { toast } from "sonner";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { usersApi } from "@/api/users.request";
import { UsersListingPageItem } from "../users-listing-page/users-listing-page.types";
import { APIError } from "@/api/base";

// Tipo atualizado com os campos corretos
interface UsersFormPageData extends UsersListingPageItem {
}

export function UsersFormPageCtrl() {
  const { id: idParam } = useParams();
  const id = idParam ? Number(idParam) : undefined;
  const router = useRouter();

  const viewForm = useViewForm<
    UsersFormPageData,
    number,
    Record<string, IResolve>,
    IResolve<UsersListingPageItem>
  >({
    id: id,
    initialData: {
      ATIVO: 1,
    },
    resolveGet: (id) => usersApi.getById(id as number),
    resolveUpdate: (id, data) =>
      usersApi.update(Number(id), data as Partial<UsersListingPageItem>),
    resolveCreate: (data) =>
      usersApi.create(data as Partial<UsersListingPageItem>),
    validateData: (d: unknown) => {
      if ((d as UsersFormPageData).EMAIL === "") {
        (d as UsersFormPageData).EMAIL = undefined;
      }

      const errors = zodWrapper(
        z.object({
          CORRETOR: z.object({
            NOME: z
              .string({
                required_error: "Nome é obrigatório", // quando o campo está ausente (undefined)
              })
              .min(1, {
                message: "Nome deve ter pelo menos 1 caracteres",
              }),
          }),
          USER_NAME: z
            .string({
              required_error: "Login é obrigatório",
              invalid_type_error: "Login deve ser um texto",
            })
            .min(1, "Login é obrigatório"),
          EMAIL: z.string().email("Email inválido").optional(),
          SENHA: id
            ? z.string().optional()
            : z
                .string({
                  required_error: "Senha é obrigatória",
                })
                .min(6, "Senha deve ter pelo menos 6 caracteres"),
        })
      )(d as unknown as UsersFormPageData);

      return errors;
    },
    handleInsertForm: (data) => {
      // Converte ACESSO (string binária) para permissions (array de boolean)
      const formData: Partial<UsersFormPageData> = { ...data };

      return formData as Partial<UsersFormPageData>;
    },
    handleFormData: (formData) => {
      // Converte permissions (array de boolean) para ACESSO (string binária)
      const apiData = { ...formData };

      return apiData as Partial<UsersFormPageData>;
    },
    onSuccess: () => {
      toast.success("Usuário salvo com sucesso");
      router.push("/users/listing");
    },
    onFailed: (error: unknown) => {
      console.log(error, "error");

      toast.error(
        (error as APIError).message
          ? (error as APIError).message
          : "Erro ao salvar usuário"
      );

      if ((error as APIError).data.error == "Login já em uso") {
        viewForm.setErrors({
          USER_NAME: "Login já em uso",
        });
        return;
      } else if ((error as APIError).data.error == "Email já em uso") {
        viewForm.setErrors({
          EMAIL: "Email já em uso",
        });
        return;
      }

      toast.error(
        (error as APIError).data.error
          ? (error as APIError).data.error
          : "Erro ao salvar usuário"
      );
    },
  });

  return {
    viewForm,
  };
}
