import { useRef, useCallback } from 'react'
import { PhotoFile, UploadStatus } from '../photo-upload.types'

/**
 * Hook responsável pelo gerenciamento da fila de upload
 * Controla processamento sequencial com limite de concorrência
 * Apenas processa fotos novas (que têm objeto File)
 */
export function useUploadQueue(
  onUpload?: (file: File) => Promise<void>,
  updatePhotoStatus?: (id: string, status: UploadStatus, error?: string) => void
) {
  
  // Fila de arquivos aguardando processamento
  const uploadQueueRef = useRef<PhotoFile[]>([])
  
  // Flag para evitar processamento simultâneo da fila
  const isProcessingRef = useRef(false)

  // Adiciona fotos à fila de upload (apenas fotos novas com objeto File)
  const addToQueue = useCallback((photos: PhotoFile[]) => {
    const photosWithFile = photos.filter(photo => photo.file)
    uploadQueueRef.current.push(...photosWithFile)
  }, [])

  // Remove foto da fila (usado quando usuário cancela)
  const removeFromQueue = useCallback((photoId: string) => {
    uploadQueueRef.current = uploadQueueRef.current.filter(p => p.id !== photoId)
  }, [])

  // Processa a fila com controle de concorrência
  const processQueue = useCallback(async () => {
    if (isProcessingRef.current || uploadQueueRef.current.length === 0) return

    isProcessingRef.current = true
    const CONCURRENT_UPLOADS = 2 // Máximo de uploads simultâneos

    while (uploadQueueRef.current.length > 0) {
      // Pega próximo lote da fila
      const batch = uploadQueueRef.current.splice(0, CONCURRENT_UPLOADS)
      
      // Processa lote em paralelo
      const uploadPromises = batch.map(async (photo) => {
        // Só processa se tem arquivo File (fotos novas)
        if (!photo.file) {
          return
        }

        updatePhotoStatus?.(photo.id, 'uploading')
        
        try {
          if (onUpload) {
            // await onUpload(photo.file)
            await new Promise(resolve => setTimeout(resolve, 2000))

            console.log(photo.id);
            updatePhotoStatus?.(photo.id, 'success')
          } else {
            // Simula upload quando não há função customizada
            await new Promise(resolve => setTimeout(resolve, 2000))
            updatePhotoStatus?.(photo.id, 'success')
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro no upload'
          updatePhotoStatus?.(photo.id, 'error', errorMessage)
        }
      })

      await Promise.all(uploadPromises)
    }

    isProcessingRef.current = false

    console.log(uploadQueueRef.current);
  }, [onUpload, updatePhotoStatus])

  // Recoloca foto na fila para retry (apenas fotos novas)
  const retryPhoto = useCallback((photo: PhotoFile) => {
    if (photo.status === 'error' && photo.file) {
      uploadQueueRef.current.push(photo)
      processQueue()
    }
  }, [processQueue])

  return {
    addToQueue, // Adiciona fotos à fila (apenas novas)
    removeFromQueue, // Remove foto da fila
    processQueue, // Inicia processamento
    retryPhoto // Recoloca foto para retry (apenas novas)
  }
} 