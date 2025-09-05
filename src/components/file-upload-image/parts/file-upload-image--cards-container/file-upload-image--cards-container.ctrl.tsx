import { useState, useEffect, useCallback } from "react";
import { FileUploadImageCardsContainerProps } from './file-upload-image--cards-container.types';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export function FileUploadImageCardsContainerCtrl(props: FileUploadImageCardsContainerProps) {
  const { images, onReorder, onRemove, onRetry, hasUploadFunction } = props;

  /** Manipula o fim do drag and drop */
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex(image => image.id === active.id);
      const newIndex = images.findIndex(image => image.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedImages = arrayMove(images, oldIndex, newIndex);
        onReorder(reorderedImages);
      }
    }
  }, [images, onReorder]);

  /** Manipula a remoção de uma imagem */
  const handleRemove = (imageId: string) => {
    onRemove(imageId);
  };

  /** Manipula o retry de uma imagem */
  const handleRetry = (imageId: string) => {
    onRetry?.(imageId);
  };

  return {
    // Handlers
    handleDragEnd,
    handleRemove,
    handleRetry,
    
    // Props processadas
    hasUploadFunction,
    
    // Estados computados
    isEmpty: images.length === 0,
  };
} 