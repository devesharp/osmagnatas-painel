import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadImageUniqueInputProps } from './upload-image-unique-input.types';
import { UploadImageUniqueInputCtrl } from './upload-image-unique-input.ctrl';

/**
 * Componente UploadImageUniqueInput
 * 
 * Componente para upload de uma única imagem com preview.
 * Suporta imagens existentes (URL) e arquivos novos.
 * 
 * Exemplo de uso:
 * ```tsx
 * // Para criar novo registro
 * <UploadImageUniqueInput
 *   file={file}
 *   onChangeFile={setFile}
 *   uploadButtonText="Carregar Imagem"
 * />
 * 
 * // Para editar registro existente
 * <UploadImageUniqueInput
 *   image={imageUrl}
 *   onChangeImage={setImageUrl}
 *   file={file}
 *   onChangeFile={setFile}
 *   uploadButtonText="Alterar Imagem"
 * />
 * ```
 */
export function UploadImageUniqueInput(props: UploadImageUniqueInputProps) {
  const {
    accept = 'image/*',
    disabled = false,
    uploadButtonText = 'Upload Imagem',
    className,
    alt = 'Imagem carregada',
    previewSize = 'md',
  } = props;

  const ctrl = UploadImageUniqueInputCtrl(props);

  // Classes para o tamanho do preview
  const previewSizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  };

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Botão de Upload */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={ctrl.openFileSelector}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {uploadButtonText}
        </Button>
        
        {ctrl.hasImage && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={ctrl.removeImage}
            disabled={disabled}
            className="text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Remover
          </Button>
        )}
      </div>

      {/* Input de arquivo oculto */}
      <input
        ref={ctrl.fileInputRef}
        type="file"
        accept={accept}
        onChange={ctrl.handleFileUpload}
        className="hidden"
        disabled={disabled}
      />

      {/* Preview da imagem */}
      {ctrl.hasImage && ctrl.currentImageUrl && (
        <div className="relative group inline-block">
          <div className={cn(
            'rounded-lg overflow-hidden bg-muted border',
            previewSizeClasses[previewSize]
          )}>
            <img
              src={ctrl.currentImageUrl}
              alt={alt}
              className="w-full h-full object-cover"
              onLoad={() => {
                // Limpa o URL do objeto após carregar para evitar vazamentos de memória
                // Só faz isso se for um arquivo novo (não uma URL existente)
                if (ctrl.isNewFile && ctrl.currentImageUrl) {
                  setTimeout(() => {
                    URL.revokeObjectURL(ctrl.currentImageUrl!);
                  }, 100);
                }
              }}
            />
          </div>
          
          {/* Botão de remover sobreposto */}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={ctrl.removeImage}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
