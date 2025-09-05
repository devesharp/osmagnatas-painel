import { useCallback } from 'react';
import { FileUploadImageCardProps } from './file-upload-image--card.types';

export function FileUploadImageCardCtrl(props: FileUploadImageCardProps) {
  const { image, onRemove, onRetry, hasUploadFunction } = props;

  /** Manipula a remoção da imagem */
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(image.id);
  };

  /** Manipula o retry da imagem */
  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRetry?.(image.id);
  };

  return {
    // Handlers
    handleRemove,
    handleRetry,
    
    // Estados computados
    canRemove: image.status !== 'uploading',
    canRetry: image.status === 'error' && hasUploadFunction,
    showError: image.status === 'error',
    showProgress: image.status === 'uploading',
    isSuccess: image.status === 'success',
    isPending: image.status === 'pending',
  };
} 