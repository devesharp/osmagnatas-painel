import { ReactNode } from 'react';

export interface FiltersContainerProps {
  /** Conteúdo dos filtros a ser exibido */
  children: ReactNode;
  /** Controla a visibilidade do modal no mobile */
  visible?: boolean;
  /** Função chamada quando o usuário solicita fechar o modal no mobile */
  onRequestClose?: () => void;
  /** Função chamada quando o usuário clica no botão de submit no mobile */
  onSubmit?: () => void;
  /** Texto do botão de submit (padrão: "Aplicar Filtros") */
  submitButtonText?: string;
  /** Indica se o botão de submit deve estar desabilitado */
  submitButtonDisabled?: boolean;
  /** Título do modal no mobile */
  title?: string;
  /** Classes CSS adicionais para o container */
  className?: string;
} 