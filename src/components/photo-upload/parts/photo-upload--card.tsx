import React from 'react'
import Image from 'next/image'
import { RotateCcw, Loader2, X, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PhotoCardProps } from './photo-upload--card.types'

export function PhotoCard({ 
  photo, 
  onRemove, 
  onRetry,
  canDrag = false,
  isDragging = false,
  isDragOver = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop
}: PhotoCardProps) {
  
  // Nome do arquivo para exibição (usa nome do file ou fallback para fotos iniciais)
  const fileName = photo.file?.name || 'Imagem'
  
  // Cria elemento de preview customizado para o drag
  const createDragPreview = () => {
    const preview = document.createElement('div')
    preview.className = 'w-24 h-24 rounded-lg overflow-hidden border-2 border-blue-400 shadow-lg bg-white'
    preview.style.transform = 'rotate(5deg)'
    
    const img = document.createElement('img')
    img.src = photo.preview
    img.className = 'w-full h-full object-cover'
    img.alt = fileName
    
    preview.appendChild(img)
    return preview
  }

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(photo.id, e)
      
      // Cria preview customizado
      const dragPreview = createDragPreview()
      document.body.appendChild(dragPreview)
      
      // Define o preview customizado
      e.dataTransfer.setDragImage(dragPreview, 48, 48) // Centro do elemento 24x24
      
      // Remove o preview após um pequeno delay
      setTimeout(() => {
        document.body.removeChild(dragPreview)
      }, 0)
    }
  }

  return (
    <div 
      className={`
        relative group rounded-lg overflow-hidden border-2 transition-all duration-200
        ${isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
      `}
      onDragOver={onDragOver ? (e) => onDragOver(photo.id, e) : undefined}
      onDragLeave={onDragLeave}
      onDrop={onDrop ? (e) => onDrop(photo.id, e) : undefined}
    >
      {/* Imagem */}
      <div className="aspect-square relative">
        {photo.status}
        {/* <Image
          src={photo.preview}
          alt={fileName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        /> */}
        
        {/* Ícone de movimento para fotos com status success */}
        {canDrag && photo.status === 'success' && (
          <div 
            id="photo-upload--card--drag-icon" 
            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
            draggable="true"
            onDragStart={handleDragStart}
            onDragEnd={onDragEnd}
          >
            <div className="bg-black/50 rounded p-1">
              <GripVertical className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
        
        {/* Overlay para status uploading */}
        {(photo.status === 'uploading' || photo.status === 'pending') && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
        
        {/* Overlay para status error - apenas para fotos novas */}
        {photo.status === 'error' && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-white text-sm mb-3 leading-tight">
              Houve um erro ao enviar sua imagem
            </p>
            {onRetry && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onRetry(photo.id)}
                className="h-8 px-3"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Tentar novamente
              </Button>
            )}
          </div>
        )}
        
        {/* Botão de remover - apenas quando não está em upload */}
        {photo.status !== 'uploading' && onRemove && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onRemove(photo.id)}
              className="h-6 w-6 p-0 rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 