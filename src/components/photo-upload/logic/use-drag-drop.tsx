import { useState, useCallback } from 'react'

/**
 * Hook responsável pela funcionalidade de drag and drop
 * Gerencia estados visuais e eventos de arrastar arquivos
 */
export function useDragDrop(
  onFilesDropped: (files: File[]) => void,
  disabled: boolean = false
) {
  
  // Controla se está em estado de drag over para feedback visual
  const [isDragOver, setIsDragOver] = useState(false)

  // Handler para quando arquivos são soltos na área
  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return
    
    const files = Array.from(event.dataTransfer.files)
    onFilesDropped(files)
  }, [onFilesDropped, disabled])

  // Handler para drag over (necessário para permitir drop)
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    
    if (disabled) return
    
    setIsDragOver(true)
  }, [disabled])

  // Handler para quando cursor sai da área de drop
  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }, [])

  // Handler para quando drag entra na área
  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    
    if (disabled) return
    
    setIsDragOver(true)
  }, [disabled])

  return {
    isDragOver, // Estado visual do drag over
    handleDrop, // Handler para drop de arquivos
    handleDragOver, // Handler para drag over
    handleDragLeave, // Handler para drag leave
    handleDragEnter // Handler para drag enter
  }
} 