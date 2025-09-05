import { useState, useCallback, useRef, useEffect } from "react";
import {
  PhotoFile,
  PhotoUploadProps,
  UploadStatus,
} from "./photo-upload.types";
import {
  useFileValidation,
  useUploadQueue,
  useDragDrop,
  usePhotoReorder,
} from "./logic";

// Constantes padrão do componente
const DEFAULT_MAX_FILES = 300;
const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/**
 * Hook principal para gerenciar o estado e lógica do upload de fotos
 * Orquestra os hooks menores e mantém o estado central do componente
 */
export function usePhotoUpload(props: PhotoUploadProps) {
  const {
    value,
    onChangeValue,
    onUpload,
    onFileStatusChange,
    onPhotosReorder,
    maxFiles = DEFAULT_MAX_FILES,
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    acceptedFileTypes = DEFAULT_ACCEPTED_TYPES,
    disabled = false,
  } = props;

  // Estado interno (usado apenas quando não há value/onChangeValue)
  const [internalPhotos, setInternalPhotos] = useState<PhotoFile[]>([]);

  // Referência para o input file oculto
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determina se está usando controle externo ou interno
  const isControlled = value !== undefined && onChangeValue !== undefined;
  const photos = isControlled ? value : internalPhotos;

  // Função para atualizar as fotos (externa ou interna)
  const updatePhotos = useCallback(
    (newPhotos: PhotoFile[] | ((prev: PhotoFile[]) => PhotoFile[])) => {
      if (isControlled) {
        const updatedPhotos = typeof newPhotos === 'function' ? newPhotos(photos) : newPhotos;
        onChangeValue!(updatedPhotos);
      } else {
        setInternalPhotos(newPhotos);
      }
    },
    [isControlled, photos, onChangeValue]
  );

  // Gera ID único para cada arquivo adicionado
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Atualiza o status de uma foto específica e notifica via callback
  const updatePhotoStatus = useCallback(
    (id: string, status: UploadStatus, error?: string) => {
      updatePhotos((prev) =>
        prev.map((photo) =>
          photo.id === id
            ? {
                ...photo,
                status,
                error,
                progress: status === "success" ? 100 : photo.progress,
              }
            : photo
        )
      );
      onFileStatusChange?.(id, status, error);
    },
    [updatePhotos, onFileStatusChange]
  );

  // Atualiza a ordem das fotos e notifica via callback
  const handlePhotosReorder = useCallback(
    (newPhotos: PhotoFile[]) => {
      updatePhotos(newPhotos);
      onPhotosReorder?.(newPhotos);
    },
    [updatePhotos, onPhotosReorder]
  );

  // Hook para validação de arquivos (considera fotos já existentes no limite)
  const { validateFiles } = useFileValidation(
    maxFileSize,
    acceptedFileTypes,
    maxFiles,
    photos.length
  );

  // Hook para gerenciamento da fila de upload
  const { addToQueue, removeFromQueue, processQueue, retryPhoto } =
    useUploadQueue(onUpload, updatePhotoStatus);

  // Hook para reordenação de fotos via drag and drop
  const {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    canDrag,
    isDragging,
    isDragOver,
  } = usePhotoReorder(photos, handlePhotosReorder);

  // Processa novos arquivos após validação
  const addFiles = useCallback(
    (files: File[]) => {
      if (disabled) return;

      // Cria objeto PhotoFile a partir de um File nativo
      const createPhotoFile = (file: File): PhotoFile => ({
        id: generateId(),
        file,
        preview: URL.createObjectURL(file), // Cria URL temporária para preview
        status: "pending" as UploadStatus,
        progress: 0,
      });

      const { validFiles, errors } = validateFiles(files);

      if (validFiles.length > 0) {
        // Converte Files em PhotoFiles
        const photoFiles = validFiles.map(createPhotoFile);

        console.log(photoFiles);
        // Adiciona ao estado e à fila de upload
        updatePhotos((prev) => [...prev, ...photoFiles]);
        addToQueue(photoFiles);
      }

      if (errors.length > 0) {
        console.warn("Erros no upload:", errors);
      }
    },
    [disabled, validateFiles, addToQueue, processQueue, updatePhotos]
  );

  useEffect(() => {
    processQueue();
  }, [photos]);

  // Hook para drag and drop de arquivos (diferente do reorder)
  const {
    isDragOver: isFilesDragOver,
    handleDrop: handleFilesDrop,
    handleDragOver: handleFilesDragOver,
    handleDragLeave: handleFilesDragLeave,
  } = useDragDrop(addFiles, disabled);

  // Handler para seleção via input file
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      addFiles(files);
      // Limpa input para permitir reselecionar mesmo arquivo
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [addFiles]
  );

  // Abre o seletor de arquivos programaticamente
  const openFileDialog = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  // Remove uma foto da lista e limpa recursos
  const removePhoto = useCallback(
    (id: string) => {
      updatePhotos((prev) => {
        const photoToRemove = prev.find((p) => p.id === id);
        if (photoToRemove && photoToRemove.file) {
          // Libera URL de preview da memória apenas para fotos com arquivo
          URL.revokeObjectURL(photoToRemove.preview);
        }
        return prev.filter((p) => p.id !== id);
      });

      // Remove da fila se ainda estiver pendente
      removeFromQueue(id);
    },
    [updatePhotos, removeFromQueue]
  );

  // Recoloca foto com erro na fila para retry
  const retryUpload = useCallback(
    (id: string) => {
      const photo = photos.find((p) => p.id === id);
      if (photo && photo.status === "error" && photo.file) {
        updatePhotoStatus(id, "pending");
        retryPhoto(photo);
      }
    },
    [photos, updatePhotoStatus, retryPhoto]
  );

  // Calcula estatísticas dos uploads para exibição
  const getUploadStats = useCallback(() => {
    const total = photos.length;
    const success = photos.filter((p) => p.status === "success").length;
    const uploading = photos.filter((p) => p.status === "uploading").length;
    const error = photos.filter((p) => p.status === "error").length;
    const pending = photos.filter((p) => p.status === "pending").length;

    return { total, success, uploading, error, pending };
  }, [photos]);

  return {
    // Estado
    photos, // Lista de fotos (externa ou interna)
    isDragOver: isFilesDragOver, // Se está em drag over para arquivos
    fileInputRef, // Ref do input file

    // Handlers de eventos para arquivos
    handleFileSelect, // Para mudança no input
    handleDrop: handleFilesDrop, // Para drop de arquivos
    handleDragOver: handleFilesDragOver, // Para drag over de arquivos
    handleDragLeave: handleFilesDragLeave, // Para drag leave de arquivos
    openFileDialog, // Para abrir seletor

    // Handlers para reordenação de fotos
    handlePhotoDragStart: handleDragStart, // Inicia drag de foto
    handlePhotoDragEnd: handleDragEnd, // Finaliza drag de foto
    handlePhotoDragOver: handleDragOver, // Drag over de foto
    handlePhotoDragLeave: handleDragLeave, // Drag leave de foto
    handlePhotoDrop: handleDrop, // Drop de foto

    // Estados de drag para fotos individuais
    canDragPhoto: canDrag, // Se pode arrastar foto
    isDraggingPhoto: isDragging, // Se está arrastando foto
    isDragOverPhoto: isDragOver, // Se está com hover na foto

    // Ações
    removePhoto, // Remove foto da lista
    retryUpload, // Tenta reenviar foto com erro
    getUploadStats, // Calcula estatísticas

    // Estado computado
    canAddMore: photos.length < maxFiles && !disabled, // Se pode adicionar mais fotos
  };
}
