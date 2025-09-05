export interface ExistingImage {
  /** URL da imagem existente */
  image: string;
  /** ID opcional da imagem */
  id?: string | number;
  /** Nome opcional da imagem */
  name?: string;
  /** URL da imagem existente */
  url?: string;
}

export interface UploadImagesInputProps {
  /** Array de arquivos de imagem carregados (novos) */
  value?: File[];
  /** Função chamada quando o valor das imagens novas é alterado */
  onChange?: (files: File[]) => void;
  /** Array de imagens existentes com URLs */
  valueExistingImages?: ExistingImage[];
  /** Função chamada quando imagens existentes são alteradas */
  onChangeExistingImages?: (images: ExistingImage[]) => void;
  /** Número máximo de imagens permitidas (incluindo existentes) */
  maxImages?: number;
  /** Tipos de arquivo aceitos (padrão: image/*) */
  accept?: string;
  /** Se o componente está desabilitado */
  disabled?: boolean;
  /** Texto do botão de upload */
  uploadButtonText?: string;
  /** Classe CSS adicional para o container */
  className?: string;
}

export interface UploadImagesInputCtrlProps extends UploadImagesInputProps {}

export interface UploadImagesInputCtrlReturn {
  /** Array de arquivos de imagem novos */
  files: File[];
  /** Array de imagens existentes */
  existingImages: ExistingImage[];
  /** Função para adicionar novas imagens */
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Função para remover uma imagem nova específica */
  removeNewImage: (index: number) => void;
  /** Função para remover uma imagem existente específica */
  removeExistingImage: (index: number) => void;
  /** Função para limpar todas as imagens novas */
  clearAllNewImages: () => void;
  /** Função para limpar todas as imagens (novas e existentes) */
  clearAllImages: () => void;
  /** Se o limite máximo de imagens foi atingido */
  isMaxReached: boolean;
  /** Total de imagens (novas + existentes) */
  totalImages: number;
  /** Referência para o input de arquivo */
  fileInputRef: React.RefObject<HTMLInputElement>;
  /** Função para abrir o seletor de arquivos */
  openFileSelector: () => void;
} 