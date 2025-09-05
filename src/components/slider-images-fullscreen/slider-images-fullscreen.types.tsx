export interface SliderImage {
  /** URL da imagem */
  src: string;
  /** Texto alternativo da imagem */
  alt: string;
  /** Título da imagem (opcional) */
  title?: string;
  /** Descrição da imagem (opcional) */
  description?: string;
}

export interface SliderImagesFullScreenProps {
  /** Array de imagens para exibir no slider */
  images: SliderImage[];
  /** Controla se o modal está aberto */
  open: boolean;
  /** Função chamada quando o modal deve ser fechado */
  onOpenChange: (open: boolean) => void;
  /** Índice inicial da imagem a ser exibida (padrão: 0) */
  initialIndex?: number;
  /** Função chamada quando o índice da imagem muda */
  onIndexChange?: (index: number) => void;
  /** Exibir contador de imagens (padrão: true) */
  showCounter?: boolean;
  /** Exibir botões de navegação nas bordas da tela (padrão: true) */
  showNavigation?: boolean;
  /** Exibir thumbnails na parte inferior (padrão: false) */
  showThumbnails?: boolean;
  /** Permitir navegação por teclado (padrão: true) */
  enableKeyboardNavigation?: boolean;
  /** Permitir zoom nas imagens (padrão: false) */
  enableZoom?: boolean;
  /** Função chamada quando uma imagem é clicada */
  onImageClick?: (image: SliderImage, index: number) => void;
  /** Classe CSS personalizada para o container */
  className?: string;
} 