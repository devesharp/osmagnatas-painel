import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadImagesInputProps } from './upload-images-input.types';
import { UploadImagesInputCtrl } from './upload-images-input.ctrl';

/**
 * Componente UploadImagesInput
 * 
 * Exemplo de uso:
 * ```tsx
 * <UploadImagesInput
 *   // props aqui
 * />
 * ```
 */
export function UploadImagesInput(props: UploadImagesInputProps) {
  const {
    accept = 'image/*',
    disabled = false,
    uploadButtonText = 'Upload Imagens',
    className,
  } = props;

  const ctrl = UploadImagesInputCtrl(props);

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Botão de Upload */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={ctrl.openFileSelector}
          disabled={disabled || ctrl.isMaxReached}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {uploadButtonText}
        </Button>
        
        {ctrl.totalImages > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={ctrl.clearAllImages}
            disabled={disabled}
            className="text-destructive hover:text-destructive"
          >
            Limpar Todas
          </Button>
        )}
      </div>

      {/* Input de arquivo oculto */}
      <input
        ref={ctrl.fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={ctrl.handleFileUpload}
        className="hidden"
        disabled={disabled}
      />

      {/* Grid de imagens carregadas */}
      {ctrl.totalImages > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Imagens existentes */}
          {ctrl.existingImages.map((existingImage, index) => (
            <div key={`existing-${existingImage.id || index}`} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted border">
                <img
                  src={existingImage.url}
                  alt={existingImage.name || `Imagem existente ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Botão de remover */}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => ctrl.removeExistingImage(index)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          
          {/* Imagens novas */}
          {ctrl.files.map((file, index) => (
            <div key={`new-${file.name}-${index}`} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted border">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                  onLoad={() => {
                    // Limpa o URL do objeto após carregar para evitar vazamentos de memória
                    URL.revokeObjectURL(URL.createObjectURL(file));
                  }}
                />
              </div>
              
              {/* Botão de remover */}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => ctrl.removeNewImage(index)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
