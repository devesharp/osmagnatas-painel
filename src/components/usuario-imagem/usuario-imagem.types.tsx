export interface UsuarioImagemProps {
  /** Valor atual da imagem (base64 ou URL) */
  value?: string;

  /** Função chamada quando a imagem muda */
  onChange?: (value: string | undefined) => void;

  /** Função chamada quando a imagem é removida */
  onRemove?: () => void;

  /** Se o componente está desabilitado */
  disabled?: boolean;

  /** Classe CSS personalizada */
  className?: string;

  /** Texto do botão de upload */
  uploadButtonText?: string;

  /** Placeholder quando não há imagem */
  placeholder?: string;
}

export interface UsuarioImagemRef {
  /** Abre o seletor de arquivos */
  openFileSelector: () => void;
}
