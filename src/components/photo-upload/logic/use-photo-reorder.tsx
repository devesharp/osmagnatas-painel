import { useState, useCallback } from 'react'
import { PhotoFile } from '../photo-upload.types'

/**
 * Hook responsável pela reordenação de fotos via drag and drop
 * Permite reordenar apenas fotos com status 'success'
 */
export function usePhotoReorder(
  photos: PhotoFile[],
  onReorder: (newPhotos: PhotoFile[]) => void
) {
  
  // ID da foto sendo arrastada atualmente
  const [draggedPhotoId, setDraggedPhotoId] = useState<string | null>(null)
  
  // ID da foto sobre a qual está sendo feito hover durante drag
  const [dragOverPhotoId, setDragOverPhotoId] = useState<string | null>(null)

  // Inicia o drag de uma foto
  const handleDragStart = useCallback((photoId: string, event: React.DragEvent) => {
    const photo = photos.find(p => p.id === photoId)
    
    // Só permite drag de fotos com status 'success'
    if (!photo || photo.status !== 'success') {
      event.preventDefault()
      return
    }
    
    setDraggedPhotoId(photoId)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', photoId)
  }, [photos])

  // Finaliza o drag
  const handleDragEnd = useCallback(() => {
    setDraggedPhotoId(null)
    setDragOverPhotoId(null)
  }, [])

  // Permite drop sobre uma foto
  const handleDragOver = useCallback((photoId: string, event: React.DragEvent) => {
    const photo = photos.find(p => p.id === photoId)
    
    // Só permite drop sobre fotos com status 'success'
    if (!photo || photo.status !== 'success') {
      return
    }
    
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setDragOverPhotoId(photoId)
  }, [photos])

  // Remove indicador visual quando sai da área de drop
  const handleDragLeave = useCallback(() => {
    setDragOverPhotoId(null)
  }, [])

  // Executa o drop e reordena as fotos
  const handleDrop = useCallback((targetPhotoId: string, event: React.DragEvent) => {
    event.preventDefault()
    
    const draggedId = event.dataTransfer.getData('text/plain')
    if (!draggedId || draggedId === targetPhotoId) {
      setDraggedPhotoId(null)
      setDragOverPhotoId(null)
      return
    }

    const draggedPhoto = photos.find(p => p.id === draggedId)
    const targetPhoto = photos.find(p => p.id === targetPhotoId)
    
    // Verifica se ambas as fotos têm status 'success'
    if (!draggedPhoto || !targetPhoto || 
        draggedPhoto.status !== 'success' || 
        targetPhoto.status !== 'success') {
      setDraggedPhotoId(null)
      setDragOverPhotoId(null)
      return
    }

    // Encontra os índices das fotos
    const draggedIndex = photos.findIndex(p => p.id === draggedId)
    const targetIndex = photos.findIndex(p => p.id === targetPhotoId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedPhotoId(null)
      setDragOverPhotoId(null)
      return
    }

    // Cria nova array com a foto reordenada
    const newPhotos = [...photos]
    const [removed] = newPhotos.splice(draggedIndex, 1)
    newPhotos.splice(targetIndex, 0, removed)

    onReorder(newPhotos)
    setDraggedPhotoId(null)
    setDragOverPhotoId(null)
  }, [photos, onReorder])

  // Verifica se uma foto pode ser arrastada
  const canDrag = useCallback((photoId: string): boolean => {
    const photo = photos.find(p => p.id === photoId)
    return photo?.status === 'success'
  }, [photos])

  // Verifica se uma foto está sendo arrastada
  const isDragging = useCallback((photoId: string): boolean => {
    return draggedPhotoId === photoId
  }, [draggedPhotoId])

  // Verifica se uma foto está com hover durante drag
  const isDragOver = useCallback((photoId: string): boolean => {
    return dragOverPhotoId === photoId
  }, [dragOverPhotoId])

  return {
    // Handlers de eventos
    handleDragStart, // Inicia drag
    handleDragEnd, // Finaliza drag
    handleDragOver, // Drag over
    handleDragLeave, // Drag leave
    handleDrop, // Drop
    
    // Estados
    canDrag, // Se pode arrastar
    isDragging, // Se está sendo arrastado
    isDragOver, // Se está com hover
    draggedPhotoId, // ID da foto sendo arrastada
  }
} 