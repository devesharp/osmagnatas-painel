import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { FileUploadImageCardProps } from './file-upload-image--card.types';
import { FileUploadImageCardCtrl } from './file-upload-image--card.ctrl';
import { X, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

/**
 * Componente FileUploadImage-Card
 * 
 * Exemplo de uso:
 * ```tsx
 * <FileUploadImage-Card
 *   // props aqui
 * />
 * ```
 */
export const FileUploadImageCard = forwardRef<HTMLDivElement, FileUploadImageCardProps>(function FileUploadImageCard(props, ref) {
  const { className, disabledDelete, ...restProps } = props;
  const { image } = restProps;
  const ctrl = FileUploadImageCardCtrl(restProps);

  return (
    <div
      ref={ref}
      className={cn(
        'relative group aspect-square rounded-lg overflow-hidden border bg-muted cursor-grab active:cursor-grabbing',
        className
      )}
    >
      {/* Preview da Imagem */}
      <img
        src={image.preview}
        alt={image.file?.name ?? ''}
        className="w-full h-full object-cover"
      />
      
      {/* Overlay de Progresso Circular */}
      {ctrl.showProgress && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="w-16 h-16">
            <CircularProgressbar
              value={image.progress || 0}
              text={`${Math.round(image.progress || 0)}%`}
              styles={buildStyles({
                textColor: 'white',
                pathColor: '#3b82f6', // blue-500
                trailColor: 'rgba(255, 255, 255, 0.2)',
                textSize: '20px',
              })}
            />
          </div>
        </div>
      )}

      {/* Overlay de Erro com Botão Tentar Novamente */}
      {ctrl.showError && (
        <div className="absolute inset-0 bg-red-500/80 flex flex-col items-center justify-center space-y-2">
          <p className="text-white text-xs text-center px-2">
            {image.error || 'Erro no upload'}
          </p>
          {ctrl.canRetry && (
            <Button
              size="sm"
              variant="secondary"
              onClick={ctrl.handleRetry}
              className="flex items-center text-xs px-2 py-1 h-auto "
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reenviar</span>
            </Button>
          )}
        </div>
      )}
      
      {ctrl.isPending && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      
      {/* Botão de Remover */}
      {!ctrl.showProgress && !disabledDelete && <Button
        variant="destructive"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 group-hover:opacity-100 transition-opacity"
        onClick={ctrl.handleRemove}
        disabled={!ctrl.canRemove}
      >
        <X className="h-3 w-3" />
      </Button>}
    </div>
  );
});
