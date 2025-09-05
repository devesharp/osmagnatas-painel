export interface ConfirmationProps {
  /** Título do modal de confirmação */
  title: string;
  /** Descrição/mensagem do modal de confirmação */
  description: string;
  /** Texto do botão de confirmação */
  confirmText: string;
  /** Texto do botão de cancelamento */
  cancelText: string;
  /** Função chamada quando o usuário confirma */
  onConfirm: () => void;
  /** Função chamada quando o usuário cancela ou fecha o modal */
  onCancel: () => void;
  /** Se o modal está aberto */
  open: boolean;
  /** Classe CSS personalizada para o container */
  className?: string;
}

export interface ConfirmationOptions {
  /** Título do modal de confirmação */
  title: string;
  /** Descrição/mensagem do modal de confirmação */
  description: string;
  /** Texto do botão de confirmação (padrão: "Confirmar") */
  confirmText?: string;
  /** Texto do botão de cancelamento (padrão: "Cancelar") */
  cancelText?: string;
} 