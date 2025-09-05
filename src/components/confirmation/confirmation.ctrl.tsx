import { useState, useEffect, useCallback } from "react";
import { ConfirmationProps } from "./confirmation.types";

export function useConfirmationCtrl(props: ConfirmationProps) {
  const {
    onConfirm,
    onCancel,
  } = props;

  // Estados do componente
  const [state, setState] = useState();

  // Efeitos
  useEffect(() => {
    // Lógica de efeito aqui
  }, []);

  // Callback para confirmar a ação
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  // Callback para cancelar a ação
  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return {
    // Estado
    state,
    
    // Ações
    handleConfirm,
    handleCancel,
  };
} 