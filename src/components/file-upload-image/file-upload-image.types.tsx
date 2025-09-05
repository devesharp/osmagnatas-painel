export interface ImageUpload {
  /** ID único da imagem */
  id: string;

  /** ID externo da imagem */
  external_id: string | number;

  /** Arquivo da imagem */
  file?: File;
  /** URL de preview da imagem */
  preview: string;
  /** Status do upload da imagem */
  status: 'pending' | 'uploading' | 'success' | 'error';
  /** Progresso do upload (0-100) */
  progress?: number;
  /** Mensagem de erro, se houver */
  error?: string;
}

export interface FileUploadImageRef {
  /** Abre o seletor de arquivos */
  openFileSelector: () => void;
}

export interface FileUploadImageProps {
  /** Array de imagens com seus respectivos status de upload */
  images: ImageUpload[];
  /** Função chamada quando há mudanças nas imagens (adicionar, remover, etc.) */
  onChange: (images: ImageUpload[]) => void;
  /** Função chamada quando há reordenação das imagens */
  onReorder?: (images: ImageUpload[]) => void;
  /** Função chamada quando há remoção de uma imagem */
  onRemove?: (image: ImageUpload) => Promise<void>;
  /** Função para fazer upload de uma imagem individual */
  onUpload?: (file: File, imageId: string, onProgress?: (progress: number) => void) => Promise<Partial<ImageUpload>>;
  /** Classe CSS personalizada para o container */
  className?: string;

  disabled?: boolean;

  /** Se o botão de deletar está desabilitado */
  disabledDelete?: boolean;

  /** Se o drag and drop está desabilitado */
  disableDragAndDrop?: boolean;
} 