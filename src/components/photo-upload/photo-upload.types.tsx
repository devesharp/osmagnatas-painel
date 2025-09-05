/**
 * Status possíveis para o upload de uma foto
 * - pending: Arquivo adicionado, aguardando processamento
 * - uploading: Upload em progresso
 * - success: Upload concluído com sucesso
 * - error: Erro durante o upload
 */
export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error'

/**
 * Interface que representa um arquivo de foto com seu estado de upload
 */
export interface PhotoFile {
  /** Identificador único do arquivo */
  id: string
  /** Objeto File nativo do browser (undefined para fotos já existentes) */
  file?: File
  /** URL de preview da imagem para exibição */
  preview: string
  /** Status atual do upload */
  status: UploadStatus
  /** Progresso do upload em porcentagem (0-100) */
  progress: number
  /** Mensagem de erro caso o upload falhe */
  error?: string
}

/**
 * Props do componente principal PhotoUpload
 */
export interface PhotoUploadProps {
  /** 
   * Array de fotos controlado externamente
   * Substitui o estado interno do componente
   */
  value?: PhotoFile[]
  
  /** 
   * Callback chamado sempre que as fotos são modificadas
   * Permite controle externo do estado
   */
  onChangeValue?: (photos: PhotoFile[]) => void
  
  /** 
   * Função chamada para cada arquivo que precisa ser enviado
   * Deve retornar Promise que resolve quando upload completa
   */
  onUpload: (file: File) => Promise<void>
  
  /** 
   * Callback executado sempre que o status de um arquivo muda
   * Útil para sincronizar com estado externo ou logging
   */
  onFileStatusChange?: (fileId: string, status: UploadStatus, error?: string) => void
  
  /** 
   * Callback executado quando as fotos são reordenadas via drag and drop
   * Recebe a nova ordem das fotos
   * @deprecated Use onChangeValue instead
   */
  onPhotosReorder?: (photos: PhotoFile[]) => void
  
  /** 
   * Número máximo de arquivos que podem ser selecionados
   * @default 10
   */
  maxFiles?: number
  
  /** 
   * Tamanho máximo permitido por arquivo em bytes
   * @default 5242880 (5MB)
   */
  maxFileSize?: number
  
  /** 
   * Array de tipos MIME aceitos para validação
   * @default ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
   */
  acceptedFileTypes?: string[]
  
  /** 
   * Classes CSS adicionais para customização do container principal
   */
  className?: string
  
  /** 
   * Desabilita toda interação com o componente
   * @default false
   */
  disabled?: boolean
}

/**
 * Props do componente PhotoCard (card individual de cada foto)
 */
export interface PhotoCardProps {
  /** Dados da foto a ser exibida */
  photo: PhotoFile
  /** Callback executado quando usuário remove a foto */
  onRemove?: (id: string) => void
  /** Callback executado quando usuário tenta reenviar foto com erro */
  onRetry?: (id: string) => void
  /** Indica se pode arrastar esta foto para reordenar */
  canDrag?: boolean
  /** Indica se esta foto está sendo arrastada */
  isDragging?: boolean
  /** Indica se esta foto está recebendo um drop */
  isDragOver?: boolean
  /** Handler para início do drag */
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, photoId: string) => void
  /** Handler para fim do drag */
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void
  /** Handler para drag over */
  onDragOver?: (e: React.DragEvent<HTMLDivElement>, photoId: string) => void
  /** Handler para drag leave */
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void
  /** Handler para drop */
  onDrop?: (e: React.DragEvent<HTMLDivElement>, photoId: string) => void
} 