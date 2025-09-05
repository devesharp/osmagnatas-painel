import { ImageUpload } from '../../file-upload-image.types';

export interface FileUploadImageCardsContainerProps {
  /** Array de imagens */
  images: ImageUpload[];
  /** Função chamada quando a ordem das imagens muda */
  onReorder: (images: ImageUpload[]) => void;
  /** Função para remover uma imagem */
  onRemove: (imageId: string) => void;
  /** Função para tentar novamente o upload */
  onRetry?: (imageId: string) => void;
  /** Se a função de upload está disponível */
  hasUploadFunction?: boolean;
  /** Classe CSS personalizada para o container */
  className?: string;

  /** Se o botão de deletar está desabilitado */
  disabledDelete?: boolean;

  /** Se o drag and drop está desabilitado */
  disableDragAndDrop?: boolean;
} 