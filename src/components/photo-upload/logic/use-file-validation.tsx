import { useCallback } from 'react'

/**
 * Hook responsável pela validação de arquivos
 * Verifica tipo, tamanho e quantidade permitida
 */
export function useFileValidation(
  maxFileSize: number,
  acceptedFileTypes: string[],
  maxFiles: number,
  currentFileCount: number
) {
  
  // Valida um arquivo individual contra os critérios definidos
  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedFileTypes.includes(file.type)) {
      return `Tipo de arquivo não suportado. Aceitos: ${acceptedFileTypes.join(', ')}`
    }
    if (file.size > maxFileSize) {
      return `Arquivo muito grande. Máximo: ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`
    }
    return null
  }, [acceptedFileTypes, maxFileSize])

  // Valida se ainda é possível adicionar mais arquivos
  const canAddMoreFiles = useCallback((newFilesCount: number): boolean => {
    return currentFileCount + newFilesCount <= maxFiles
  }, [currentFileCount, maxFiles])

  // Valida um array de arquivos e retorna válidos e erros
  const validateFiles = useCallback((files: File[]) => {
    const validFiles: File[] = []
    const errors: string[] = []

    files.forEach(file => {
      // Valida arquivo individual
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
        return
      }

      // Verifica limite de quantidade
      if (!canAddMoreFiles(validFiles.length + 1)) {
        errors.push(`Máximo de ${maxFiles} arquivos permitidos`)
        return
      }

      validFiles.push(file)
    })

    return { validFiles, errors }
  }, [validateFile, canAddMoreFiles, maxFiles])

  return {
    validateFile, // Valida arquivo individual
    validateFiles, // Valida array de arquivos
    canAddMoreFiles // Verifica se pode adicionar mais
  }
} 