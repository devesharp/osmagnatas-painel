import { useCallback, useRef, useState } from "react";
import { FileUploadImageProps, ImageUpload } from "./file-upload-image.types";
import useDeepEffect from "@lucarestagno/use-deep-effect";

export function FileUploadImageCtrl(props: FileUploadImageProps) {
  const { images, onChange, onUpload } = props;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado local para manter as imagens sem depender de re-renders do componente pai
  const [imagesLocal, setImagesLocal] = useState<ImageUpload[]>(images);

  // Mantém o estado local sincronizado caso o componente pai altere o array externamente
  useDeepEffect(() => {
    setImagesLocal(images);
  }, [images]);

  /**
   * Helper que atualiza o estado local e garante que o onChange receba
   * a atualização correta baseada no valor anterior.
   */
  const updateImages = useCallback(
    (updater: (prev: ImageUpload[]) => ImageUpload[]) => {
      setImagesLocal((prev) => {
        const next = updater(prev);
        // Evita atualizar o componente pai durante a fase de renderização
        // Posta a atualização em micro-task para ser executada após o commit
        queueMicrotask(() => {
          onChange(next);
        });
        return next;
      });
    },
    [onChange]
  );

  /** Gera um ID único para a imagem */
  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }, []);

  /** Atualiza o status de uma imagem específica */
  function updateImageStatus(
    imageId: string,
    status: ImageUpload["status"],
    error?: string,
    progress?: number
  ) {
    updateImages((prev) => {
      return prev.map((img) =>
        img.id === imageId ? { ...img, status, error, progress } : img
      );
    });
  }

  /** Atualiza o status de múltiplas imagens */
  function updateMultipleImageStatus(
    updates: Array<{
      id: string;
      status: ImageUpload["status"];
      error?: string;
      progress?: number;
      external_id?: string | number;
    }>
  ) {
    updateImages((prev) => {
      return prev.map((img) => {
        const update = updates.find((u) => u.id === img.id);
        return update
          ? {
              ...img,
              ...update,
            }
          : img;
      });
    });
  }

  /** Atualiza apenas o progresso de uma imagem */
  function updateImageProgress(imageId: string, progress: number) {
    updateImages((prev) => {
      return prev.map((img) =>
        img.id === imageId ? { ...img, progress, status: "uploading" as const } : img
      );
    });
  }

  /** Processa a fila de upload das imagens pendentes ou com erro (2 por vez) */
  const uploadingImages = useRef(false);
  async function onUploadQueue() {
    if (!onUpload) return;
    if (uploadingImages.current) return;
    uploadingImages.current = true;

    // Filtra imagens que precisam ser enviadas
    const imagesToUpload = imagesLocal.filter((img) => img.status === "pending");

    if (imagesToUpload.length === 0) {
      uploadingImages.current = false;
      return;
    }

    // Processa em lotes de 2 imagens
    const batchSize = 2;

    for (let i = 0; i < imagesToUpload.length; i += batchSize) {
      const batch = imagesToUpload.slice(i, i + batchSize);

      // Atualiza status para "uploading" para todas as imagens do lote
      const uploadingUpdates = batch.map((img) => ({
        id: img.id,
        status: "uploading" as const,
        progress: 0,
      }));
      updateMultipleImageStatus(uploadingUpdates);

      // Executa uploads em paralelo
      const uploadPromises = batch.map(async (image) => {
        try {
          // Callback para atualizar progresso
          const onProgress = (progress: number) => {
            updateImageProgress(image.id, progress);
          };

          const response = await onUpload(image.file!, image.id, onProgress);
          return { id: image.id, status: "success" as const, progress: 100, ...response };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Erro no upload";
          return {
            id: image.id,
            status: "error" as const,
            error: errorMessage,
            progress: 0,
          };
        }
      });

      // Aguarda todos os uploads do lote completarem
      const results = await Promise.all(uploadPromises);

      // Atualiza status com os resultados
      updateMultipleImageStatus(results);
    }

    uploadingImages.current = false;
  }

  /** Tenta novamente o upload de uma imagem com erro */
  function retryImage(imageId: string) {
    updateImageStatus(imageId, "pending", undefined, 0);
  }

  useDeepEffect(() => {
    onUploadQueue();
  }, [imagesLocal]);

  /** Processa os arquivos selecionados */
  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const newImages: ImageUpload[] = [];

      fileArray.forEach((file) => {
        // Verifica se é uma imagem
        if (file.type.startsWith("image/")) {
          const preview = URL.createObjectURL(file);
          newImages.push({
            id: generateId(),
            file,
            preview,
            status: "pending",
            progress: 0,
            external_id: "",
          });
        }
      });

      if (newImages.length > 0) {
        updateImages((prev) => [...prev, ...newImages]);
      }
    },
    [imagesLocal, onChange, generateId]
  );

  /** Manipula o clique no botão de upload */
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /** Manipula a mudança no input de arquivo */
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
      // Limpa o input para permitir selecionar o mesmo arquivo novamente
      event.target.value = "";
    },
    [processFiles]
  );

  /** Manipula eventos de drag and drop */
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  /** Remove uma imagem da lista */
  const removeImage = useCallback(
    async (imageId: string) => {
      const imageToRemove = imagesLocal.find((img) => img.id === imageId);
      if (imageToRemove) {
        // Revoga a URL do objeto para liberar memória
        URL.revokeObjectURL(imageToRemove.preview);

        if (props.onRemove) {
          try {
            await props.onRemove(imageToRemove);
          } catch (error) {
            return;
          }
        }
      }
      updateImages((prev) => prev.filter((img) => img.id !== imageId));
    },
    [imagesLocal, onChange]
  );

  /** Limpa todas as URLs de preview quando o componente é desmontado */
  const cleanup = useCallback(() => {
    imagesLocal.forEach((image) => {
      URL.revokeObjectURL(image.preview);
    });
  }, [imagesLocal]);

  return {
    // Refs
    fileInputRef,

    // Handlers
    handleClick,
    handleFileChange,
    handleDragOver,
    handleDrop,
    removeImage,
    cleanup,
    onUploadQueue,
    retryImage,

    // Estados computados
    isEmpty: imagesLocal.length === 0,
    hasUploadableImages: imagesLocal.some(
      (img) => img.status === "pending" || img.status === "error"
    ),
    isUploading: imagesLocal.some((img) => img.status === "uploading"),
    imagesLocal,
  };
}
