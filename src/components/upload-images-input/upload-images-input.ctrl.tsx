import { useRef, useCallback } from 'react';
import { UploadImagesInputCtrlProps, UploadImagesInputCtrlReturn } from './upload-images-input.types';

export function UploadImagesInputCtrl(props: UploadImagesInputCtrlProps) {
  const {
    value = [],
    onChange,
    valueExistingImages = [],
    onChangeExistingImages,
    maxImages = 10,
    accept = 'image/*',
    disabled = false,
  } = props;

  // Referência para o input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Array atual de arquivos novos
  const files = value;

  // Array de imagens existentes
  const existingImages = valueExistingImages;

  // Total de imagens (novas + existentes)
  const totalImages = files.length + existingImages.length;

  // Verifica se o limite máximo foi atingido
  const isMaxReached = totalImages >= maxImages;

  // Função para abrir o seletor de arquivos
  const openFileSelector = useCallback(() => {
    if (disabled || isMaxReached) return;
    fileInputRef.current?.click();
  }, [disabled, isMaxReached]);

  // Função para lidar com o upload de arquivos
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || !onChange) return;

    // Converte FileList para Array
    const newFiles = Array.from(selectedFiles);
    
    // Filtra apenas arquivos de imagem válidos
    const validImageFiles = newFiles.filter(file => {
      return file.type.startsWith('image/');
    });

    // Calcula quantas imagens podem ser adicionadas (considerando existentes)
    const remainingSlots = maxImages - totalImages;
    const filesToAdd = validImageFiles.slice(0, remainingSlots);

    // Adiciona as novas imagens ao array existente
    const updatedFiles = [...files, ...filesToAdd];
    
    // Chama o onChange com o array atualizado
    onChange(updatedFiles);

    // Limpa o input para permitir selecionar os mesmos arquivos novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [files, onChange, maxImages, totalImages]);

  // Função para remover uma imagem nova específica
  const removeNewImage = useCallback((index: number) => {
    if (!onChange) return;
    
    const updatedFiles = files.filter((_, i) => i !== index);
    onChange(updatedFiles);
  }, [files, onChange]);

  // Função para remover uma imagem existente específica
  const removeExistingImage = useCallback((index: number) => {
    if (!onChangeExistingImages) return;
    
    const updatedExistingImages = existingImages.filter((_, i) => i !== index);
    onChangeExistingImages(updatedExistingImages);
  }, [existingImages, onChangeExistingImages]);

  // Função para limpar todas as imagens novas
  const clearAllNewImages = useCallback(() => {
    if (!onChange) return;
    onChange([]);
  }, [onChange]);

  // Função para limpar todas as imagens (novas e existentes)
  const clearAllImages = useCallback(() => {
    if (onChange) {
      onChange([]);
    }
    if (onChangeExistingImages) {
      onChangeExistingImages([]);
    }
  }, [onChange, onChangeExistingImages]);

  return {
    files,
    existingImages,
    handleFileUpload,
    removeNewImage,
    removeExistingImage,
    clearAllNewImages,
    clearAllImages,
    isMaxReached,
    totalImages,
    fileInputRef,
    openFileSelector,
  };
} 