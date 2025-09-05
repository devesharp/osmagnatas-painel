import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { SliderImagesFullScreenProps } from "./slider-images-fullscreen.types";

export function useSliderImagesFullScreenCtrl(props: SliderImagesFullScreenProps) {
  const {
    images,
    open,
    onOpenChange,
    initialIndex = 0,
    onIndexChange,
    enableKeyboardNavigation = true,
    enableZoom = false,
  } = props;

  // Estado do índice atual da imagem
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  // Estado do zoom
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Atualiza o índice quando o initialIndex muda
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Função para ir para a próxima imagem
  const goToNext = useCallback(() => {
    if (images.length === 0) return;
    
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(nextIndex);
    onIndexChange?.(nextIndex);
    
    // Reset zoom quando muda de imagem
    if (isZoomed) {
      setIsZoomed(false);
      setZoomLevel(1);
    }
  }, [currentIndex, images.length, onIndexChange, isZoomed]);

  // Função para ir para a imagem anterior
  const goToPrevious = useCallback(() => {
    if (images.length === 0) return;
    
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    onIndexChange?.(prevIndex);
    
    // Reset zoom quando muda de imagem
    if (isZoomed) {
      setIsZoomed(false);
      setZoomLevel(1);
    }
  }, [currentIndex, images.length, onIndexChange, isZoomed]);

  // Função para ir para um índice específico
  const goToIndex = useCallback((index: number) => {
    if (index < 0 || index >= images.length) return;
    
    setCurrentIndex(index);
    onIndexChange?.(index);
    
    // Reset zoom quando muda de imagem
    if (isZoomed) {
      setIsZoomed(false);
      setZoomLevel(1);
    }
  }, [images.length, onIndexChange, isZoomed]);

  // Função para fechar o modal
  const handleClose = useCallback(() => {
    onOpenChange(false);
    
    // Reset zoom quando fecha
    if (isZoomed) {
      setIsZoomed(false);
      setZoomLevel(1);
    }
  }, [onOpenChange, isZoomed]);

  // Função para alternar zoom
  const toggleZoom = useCallback(() => {
    if (!enableZoom) return;
    
    if (isZoomed) {
      setIsZoomed(false);
      setZoomLevel(1);
    } else {
      setIsZoomed(true);
      setZoomLevel(2);
    }
  }, [enableZoom, isZoomed]);

  // Função para aumentar zoom
  const zoomIn = useCallback(() => {
    if (!enableZoom) return;
    
    const newZoomLevel = Math.min(zoomLevel + 0.5, 3);
    setZoomLevel(newZoomLevel);
    setIsZoomed(newZoomLevel > 1);
  }, [enableZoom, zoomLevel]);

  // Função para diminuir zoom
  const zoomOut = useCallback(() => {
    if (!enableZoom) return;
    
    const newZoomLevel = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoomLevel);
    setIsZoomed(newZoomLevel > 1);
  }, [enableZoom, zoomLevel]);

  // Navegação por teclado
  useEffect(() => {
    if (!open || !enableKeyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          goToPrevious();
          break;
        case "ArrowRight":
          event.preventDefault();
          goToNext();
          break;
        case "Escape":
          event.preventDefault();
          handleClose();
          break;
        case "+":
        case "=":
          if (enableZoom) {
            event.preventDefault();
            zoomIn();
          }
          break;
        case "-":
          if (enableZoom) {
            event.preventDefault();
            zoomOut();
          }
          break;
        case "0":
          if (enableZoom) {
            event.preventDefault();
            setIsZoomed(false);
            setZoomLevel(1);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, enableKeyboardNavigation, goToNext, goToPrevious, handleClose, enableZoom, zoomIn, zoomOut]);

  // Imagem atual
  const currentImage = images[currentIndex];

  // Verificar se pode navegar
  const canGoNext = images.length > 1;
  const canGoPrevious = images.length > 1;

  // Ícones
  const PreviousIcon = ChevronLeft;
  const NextIcon = ChevronRight;
  const CloseIcon = X;
  const ZoomInIcon = ZoomIn;
  const ZoomOutIcon = ZoomOut;

  return {
    // Estado
    currentIndex,
    currentImage,
    isZoomed,
    zoomLevel,
    
    // Navegação
    goToNext,
    goToPrevious,
    goToIndex,
    canGoNext,
    canGoPrevious,
    
    // Modal
    handleClose,
    
    // Zoom
    toggleZoom,
    zoomIn,
    zoomOut,
    
    // Ícones
    PreviousIcon,
    NextIcon,
    CloseIcon,
    ZoomInIcon,
    ZoomOutIcon,
  };
} 