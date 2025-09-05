export interface UploadImageUniqueInputProps {
  /** URL da imagem existente (string) */
  image?: string;
  /** Função chamada quando a imagem é alterada */
  onChangeImage?: (image: string | null) => void;
  /** Arquivo de imagem carregado (novo) */
  file?: File | null;
  /** Função chamada quando o arquivo é alterado */
  onChangeFile?: (file: File | null) => void;
  /** Tipos de arquivo aceitos (padrão: image/*) */
  accept?: string;
  /** Se o componente está desabilitado */
  disabled?: boolean;
  /** Texto do botão de upload */
  uploadButtonText?: string;
  /** Classe CSS adicional para o container */
  className?: string;
  /** Texto alternativo para a imagem */
  alt?: string;
  /** Tamanho do preview da imagem */
  previewSize?: 'sm' | 'md' | 'lg';
}

export interface UploadImageUniqueInputCtrlProps extends UploadImageUniqueInputProps {}

export interface UploadImageUniqueInputCtrlReturn {
  /** URL da imagem atual (pode ser string ou URL do arquivo) */
  currentImageUrl: string | null;
  /** Se existe uma imagem (URL ou arquivo) */
  hasImage: boolean;
  /** Função para lidar com upload de arquivo */
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Função para remover a imagem atual */
  removeImage: () => void;
  /** Referência para o input de arquivo */
  fileInputRef: React.RefObject<HTMLInputElement>;
  /** Função para abrir o seletor de arquivos */
  openFileSelector: () => void;
  /** Se é uma imagem existente (URL) */
  isExistingImage: boolean;
  /** Se é um arquivo novo */
  isNewFile: boolean;
} 