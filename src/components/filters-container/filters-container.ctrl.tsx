import { useIsMobile } from '@/hooks/use-mobile';
import { FiltersContainerProps } from './filters-container.types';

export function useFiltersContainerCtrl(props: FiltersContainerProps) {
  const {
    visible = false,
    onRequestClose,
    onSubmit,
    submitButtonText = 'Aplicar Filtros',
    submitButtonDisabled = false,
    title = 'Filtros',
  } = props;

  // Hook para detectar se está em mobile
  const isMobile = useIsMobile();

  // Função para lidar com o submit no mobile
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  // Função para lidar com o fechamento do modal
  const handleClose = () => {
    if (onRequestClose) {
      onRequestClose();
    }
  };

  return {
    isMobile,
    visible,
    handleSubmit,
    handleClose,
    submitButtonText,
    submitButtonDisabled,
    title,
  };
} 