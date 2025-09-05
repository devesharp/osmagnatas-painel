import React from "react";
import { cn } from "@/lib/utils";
import { ConfirmationProps } from "./confirmation.types";
import { useConfirmationCtrl } from "./confirmation.ctrl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Componente Confirmation
 * 
 * Modal de confirmação que pode ser usado para solicitar confirmação do usuário
 * antes de executar uma ação importante.
 * 
 * Exemplo de uso:
 * ```tsx
 * <Confirmation
 *   open={isOpen}
 *   title="Confirmar exclusão"
 *   description="Tem certeza que deseja excluir este item?"
 *   confirmText="Excluir"
 *   cancelText="Cancelar"
 *   onConfirm={() => console.log('Confirmado')}
 *   onCancel={() => console.log('Cancelado')}
 * />
 * ```
 */
export function Confirmation(props: ConfirmationProps) {
  const { 
    title, 
    description, 
    confirmText, 
    cancelText, 
    onConfirm, 
    onCancel, 
    open,
    className 
  } = props;
  
  const ctrl = useConfirmationCtrl(props);

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent className={cn(className)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
