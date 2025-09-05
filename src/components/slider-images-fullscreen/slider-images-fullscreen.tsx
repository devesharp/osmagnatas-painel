import React from "react";
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SliderImagesFullScreenProps } from "./slider-images-fullscreen.types";
import { useSliderImagesFullScreenCtrl } from "./slider-images-fullscreen.ctrl";
import Image from "next/image";

/**
 * Componente SliderImagesFullScreen - Exibe um slider de imagens em tela cheia
 * 
 * Exemplo de uso:
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * const [currentIndex, setCurrentIndex] = useState(0);
 * 
 * const images = [
 *   { src: "/image1.jpg", alt: "Imagem 1", title: "Título 1" },
 *   { src: "/image2.jpg", alt: "Imagem 2", title: "Título 2" },
 * ];
 * 
 * <SliderImagesFullScreen
 *   images={images}
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   initialIndex={currentIndex}
 *   onIndexChange={setCurrentIndex}
 *   showCounter={true}
 *   enableZoom={true}
 * />
 * ```
 * 
 * Navegação por teclado:
 * - Setas esquerda/direita: navegar entre imagens
 * - Escape: fechar modal
 * - +/=: aumentar zoom
 * - -: diminuir zoom
 * - 0: resetar zoom
 */
export function SliderImagesFullScreen(props: SliderImagesFullScreenProps) {
  const {
    images,
    open,
    showCounter = true,
    showNavigation = true,
    showThumbnails = false,
    enableZoom = false,
    className,
  } = props;

  const ctrl = useSliderImagesFullScreenCtrl(props);

  if (!open || images.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={props.onOpenChange}>
      <DialogPortal>

        <DialogOverlay className="bg-black/20 backdrop-blur-sm" />
        
        <DialogContent
          className={cn(
            "fixed z-50 flex items-center justify-center h-screen w-screen max-w-none rounded-none border-none bg-transparent p-0 shadow-none sm:max-w-none max-h-[calc(95vh)]",
            className
          )}
          showCloseButton={false}
        >
          {/* Botão de fechar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={ctrl.handleClose}
            className="absolute right-4 top-4 z-20 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
          >
            <ctrl.CloseIcon className="h-5 w-5" />
            <span className="sr-only">Fechar</span>
          </Button>

          {/* Contador */}
          {showCounter && images.length > 1 && (
            <div className="absolute left-4 top-4 z-20 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {ctrl.currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Botões de navegação - nas bordas da tela */}
          {showNavigation && images.length > 1 && (
            <>
              {/* Botão anterior - borda esquerda */}
              <Button
                onClick={ctrl.goToPrevious}
                disabled={!ctrl.canGoPrevious}
                className="h-12 w-12 absolute left-0 top-0 z-20 top-1/2 -translate-y-1/2 bg-black/50 rounded-none [&_svg:not([class*='size-'])]:size-7 hover:bg-black/90 cursor-pointer"
              >
                <ctrl.PreviousIcon className="h-12 w-12 text-white" />
                <span className="sr-only">Imagem anterior</span>
              </Button>

              {/* Botão próximo - borda direita */}
              <Button
                variant="ghost"
                size="icon"
                onClick={ctrl.goToNext}
                disabled={!ctrl.canGoNext}
                className="h-12 w-12 absolute right-0 top-0 z-20 top-1/2 -translate-y-1/2 bg-black/50 rounded-none [&_svg:not([class*='size-'])]:size-7 hover:bg-black/90 cursor-pointer"
              >
                <ctrl.NextIcon className="h-12 w-12 text-white" />
                <span className="sr-only">Próxima imagem</span>
              </Button>
            </>
          )}

          {/* Container da imagem com animação de slide */}
          <div className="flex h-full w-[95vw] items-center justify-center overflow-hidden">
            <div
              className="flex h-full transition-transform duration-500 ease-in-out"
              style={{
                width: `${images.length * 100}%`,
                transform: `translateX(-${(ctrl.currentIndex * 100)}%)`
              }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative flex h-full items-center justify-center flex-shrink-0 flex-[0_0_100%]",
                    enableZoom && ctrl.isZoomed && "cursor-zoom-out",
                    enableZoom && !ctrl.isZoomed && "cursor-zoom-in"
                  )}
                  style={{ width: `${100 / images.length}%` }}
                  onClick={enableZoom ? ctrl.toggleZoom : undefined}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    className={cn(
                      "h-full w-full object-contain transition-transform duration-200",
                      enableZoom && ctrl.isZoomed && `scale-${Math.floor(ctrl.zoomLevel * 100)}`
                    )}
                    fill
                    priority={Math.abs(index - ctrl.currentIndex) <= 1} // Priorizar imagem atual e adjacentes
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          {showThumbnails && images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-lg bg-black/50 p-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => ctrl.goToIndex(index)}
                  className={cn(
                    "h-12 w-12 overflow-hidden rounded border-2 transition-all",
                    index === ctrl.currentIndex
                      ? "border-white"
                      : "border-transparent opacity-60 hover:opacity-80"
                  )}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
} 