import { ImageUpload } from '../../file-upload-image.types';

export interface FileUploadImageCardProps {
  /** Dados da imagem */
  image: ImageUpload;
  /** Função para remover a imagem */
  onRemove: (imageId: string) => void;
  /** Função para tentar novamente o upload */
  onRetry?: (imageId: string) => void;
  /** Se a função de upload está disponível */
  hasUploadFunction?: boolean;
  /** Classe CSS personalizada para o container */
  className?: string;
  /** Se o botão de deletar está desabilitado */
  disabledDelete?: boolean;
} 