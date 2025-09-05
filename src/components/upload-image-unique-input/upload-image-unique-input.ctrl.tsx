import { useRef, useCallback, useMemo } from 'react';
import { UploadImageUniqueInputCtrlProps, UploadImageUniqueInputCtrlReturn } from './upload-image-unique-input.types';

export function UploadImageUniqueInputCtrl(props: UploadImageUniqueInputCtrlProps) {
  const {
    image,
    onChangeImage,
    file,
    onChangeFile,
    accept = 'image/*',
    disabled = false,
  } = props;

  // Referência para o input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determina se é uma imagem existente (URL) ou arquivo novo
  const isExistingImage = Boolean(image && !file);
  const isNewFile = Boolean(file);
  const hasImage = isExistingImage || isNewFile;

  // URL da imagem atual (pode ser URL string ou URL do arquivo)
  const currentImageUrl = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return image || null;
  }, [file, image]);

  // Função para abrir o seletor de arquivos
  const openFileSelector = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  // Função para lidar com o upload de arquivo
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Verifica se é um arquivo de imagem válido
    if (!selectedFile.type.startsWith('image/')) {
      console.warn('Arquivo selecionado não é uma imagem válida');
      return;
    }

    // Remove a imagem existente se houver
    if (image && onChangeImage) {
      onChangeImage(null);
    }

    // Define o novo arquivo
    if (onChangeFile) {
      onChangeFile(selectedFile);
    }

    // Limpa o input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [image, onChangeImage, onChangeFile]);

  // Função para remover a imagem atual
  const removeImage = useCallback(() => {
    // Remove a imagem existente se houver
    if (image && onChangeImage) {
      onChangeImage(null);
    }

    // Remove o arquivo se houver
    if (file && onChangeFile) {
      onChangeFile(null);
    }

    // Limpa o input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [image, onChangeImage, file, onChangeFile]);

  return {
    currentImageUrl,
    hasImage,
    handleFileUpload,
    removeImage,
    fileInputRef,
    openFileSelector,
    isExistingImage,
    isNewFile,
  };
} 