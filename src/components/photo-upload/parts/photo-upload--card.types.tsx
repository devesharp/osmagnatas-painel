import { PhotoFile } from '../photo-upload.types'

/**
 * Props do componente PhotoCard
 * Representa um card individual de foto com preview e controles
 */
export interface PhotoCardProps {
  /** Objeto com dados da foto e status do upload */
  photo: PhotoFile
  
  /** Callback chamado quando usuário remove a foto */
  onRemove?: (id: string) => void
  
  /** Callback chamado quando usuário tenta reenviar foto com erro */
  onRetry?: (id: string) => void

  // Props para drag and drop
  /** Se a foto pode ser arrastada (apenas success) */
  canDrag?: boolean
  
  /** Se a foto está sendo arrastada atualmente */
  isDragging?: boolean
  
  /** Se há uma foto sendo arrastada sobre esta */
  isDragOver?: boolean
  
  /** Handler para início do drag */
  onDragStart?: (photoId: string, event: React.DragEvent) => void
  
  /** Handler para fim do drag */
  onDragEnd?: () => void
  
  /** Handler para drag over */
  onDragOver?: (photoId: string, event: React.DragEvent) => void
  
  /** Handler para drag leave */
  onDragLeave?: () => void
  
  /** Handler para drop */
  onDrop?: (photoId: string, event: React.DragEvent) => void
} 