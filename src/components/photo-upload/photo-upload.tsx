import React from "react";
import {
  Upload,
  Image as ImageIcon,
  ImageUpIcon,
  UploadIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoUploadProps } from "./photo-upload.types";
import { usePhotoUpload } from "./photo-upload.ctrl";
import { PhotoCard } from "./parts";

export function PhotoUpload(props: PhotoUploadProps) {
  const ctrl = usePhotoUpload(props);

  return (
    <div className="w-full space-y-4">
      
      {/* Área de upload */}
      <div
        className={`
          border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px] 
          ${ctrl.isDragOver ? "border-primary bg-blue-50" : "border-gray-300"}
          ${
            props.disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:border-primary"
          }
        `}
        onClick={ctrl.openFileDialog}
        onDrop={ctrl.handleDrop}
        onDragOver={ctrl.handleDragOver}
        onDragLeave={ctrl.handleDragLeave}
      >
        <input
          ref={ctrl.fileInputRef}
          type="file"
          multiple
          accept={props.acceptedFileTypes?.join(",")}
          onChange={ctrl.handleFileSelect}
          className="hidden"
          disabled={props.disabled}
        />

        <div
          className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
          aria-hidden="true"
        >
          <ImageUpIcon className="size-4 opacity-60" />
        </div>

        <p className="mb-1.5 text-sm font-medium">
          Arraste suas fotos aqui ou clique para selecionar
        </p>

        <Button variant="outline" className="mt-4">
          <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
          Selecionar fotos
        </Button>
      </div>

      {/* Grid de fotos */}
      {ctrl.photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ctrl.photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onRemove={ctrl.removePhoto}
              onRetry={ctrl.retryUpload}
              canDrag={ctrl.canDragPhoto(photo.id)}
              isDragging={ctrl.isDraggingPhoto(photo.id)}
              isDragOver={ctrl.isDragOverPhoto(photo.id)}
              onDragStart={ctrl.handlePhotoDragStart}
              onDragEnd={ctrl.handlePhotoDragEnd}
              onDragOver={ctrl.handlePhotoDragOver}
              onDragLeave={ctrl.handlePhotoDragLeave}
              onDrop={ctrl.handlePhotoDrop}
            />
          ))}
        </div>
      )}

      {/* Estatísticas */}
      {ctrl.photos.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          {(() => {
            const stats = ctrl.getUploadStats();
            const parts = [];

            if (stats.success > 0)
              parts.push(
                `${stats.success} enviada${stats.success > 1 ? "s" : ""}`
              );
            if (stats.uploading > 0) parts.push(`${stats.uploading} enviando`);
            if (stats.error > 0) parts.push(`${stats.error} com erro`);
            if (stats.pending > 0)
              parts.push(
                `${stats.pending} pendente${stats.pending > 1 ? "s" : ""}`
              );

            return parts.join(" • ");
          })()}
        </div>
      )}
    </div>
  );
}
