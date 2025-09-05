import { useEffect, forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";
import { FileUploadImageProps, FileUploadImageRef } from "./file-upload-image.types";
import { FileUploadImageCtrl } from "./file-upload-image.ctrl";
import { Upload, CloudUpload, UploadIcon, ImageUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUploadImageCardsContainer } from "./parts/file-upload-image--cards-container";

/**
 * Componente FileUploadImage
 *
 * Exemplo de uso:
 * ```tsx
 * <FileUploadImage
 *   // props aqui
 * />
 * ```
 */
export const FileUploadImage = forwardRef<FileUploadImageRef, FileUploadImageProps>((props, ref) => {
  const { className, ...restProps } = props;
  const ctrl = FileUploadImageCtrl(restProps);

  // Expõe métodos através da ref
  useImperativeHandle(ref, () => ({
    openFileSelector: ctrl.handleClick,
  }), [ctrl.handleClick]);

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Área de Upload */}
      {!props.disabled && (
        <div className={cn("")}>
          <input
            ref={ctrl.fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={ctrl.handleFileChange}
            className="hidden"
          />
          <Button variant="outline" className="mt-4" onClick={ctrl.handleClick}>
            <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
            Adicionar fotos
          </Button>
        </div>
      )}

      {/* Preview das Imagens */}
      {!ctrl.isEmpty && (
        <div className="space-y-3">
          {/* Container de Cards com Drag and Drop */}
          <FileUploadImageCardsContainer
            images={props.images}
            onReorder={props.onReorder ?? props.onChange}
            onRemove={ctrl.removeImage}
            onRetry={ctrl.retryImage}
            hasUploadFunction={!!props.onUpload}
            disabledDelete={props.disabledDelete}
            disableDragAndDrop={props.disableDragAndDrop}
          />
        </div>
      )}
    </div>
  );
});

FileUploadImage.displayName = "FileUploadImage";
