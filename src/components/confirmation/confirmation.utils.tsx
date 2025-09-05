import React from "react";
import { ConfirmationOptions } from "./confirmation.types";
import { Confirmation } from "./confirmation";

// Variável global para armazenar a função de abertura de modal
let globalOpenModal: ((id: string, content: React.ReactNode) => void) | null = null;
let globalCloseModal: ((id: string) => void) | null = null;

// Função para registrar as funções globais de modal
export function registerModalFunctions(
  openModal: (id: string, content: React.ReactNode) => void,
  closeModal: (id: string) => void
) {
  globalOpenModal = openModal;
  globalCloseModal = closeModal;
}

/**
 * Função global para exibir um modal de confirmação
 * 
 * @param title - Título do modal
 * @param description - Descrição/mensagem do modal
 * @param confirmText - Texto do botão de confirmação (padrão: "Confirmar")
 * @param cancelText - Texto do botão de cancelamento (padrão: "Cancelar")
 * @returns Promise que resolve quando o usuário confirma e rejeita quando cancela
 * 
 * Exemplo de uso:
 * ```tsx
 * confirmation("Excluir item", "Tem certeza que deseja excluir?", "Excluir", "Cancelar")
 *   .then(() => {
 *     console.log('Usuário confirmou');
 *   })
 *   .catch(() => {
 *     console.log('Usuário cancelou');
 *   });
 * ```
 */
export function confirmation(
  title: string,
  description: string,
  confirmText: string = "Confirmar",
  cancelText: string = "Cancelar"
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!globalOpenModal || !globalCloseModal) {
      console.error('Modal functions not registered. Make sure ModalProvider is properly set up.');
      reject(new Error('Modal system not initialized'));
      return;
    }

    const modalId = `confirmation-${Date.now()}-${Math.random()}`;

    const handleConfirm = () => {
      globalCloseModal!(modalId);
      resolve(true);
    };

    const handleCancel = () => {
      globalCloseModal!(modalId);
      resolve(false);
    };

    const confirmationModal = (
      <Confirmation
        open={true}
        title={title}
        description={description}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );

    globalOpenModal(modalId, confirmationModal);
  });
} 

export function confirmationDelete(
  title = "Tem certeza que deseja excluir este item?",
  description = "Esta ação não pode ser desfeita. Tem certeza que deseja excluir este item permanentemente?",
  confirmText = "Excluir",
  cancelText = "Cancelar",
) {
  return confirmation(title, description, confirmText, cancelText);
}