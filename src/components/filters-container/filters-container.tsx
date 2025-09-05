'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { FiltersContainerProps } from './filters-container.types';
import { useFiltersContainerCtrl } from './filters-container.ctrl';

export function FiltersContainer(props: FiltersContainerProps) {
  const { children, className, onSubmit } = props;
  
  const ctrl = useFiltersContainerCtrl(props);

  // No desktop, simplesmente exibe o children
  if (!ctrl.isMobile) {
    return (
      <div className={cn('filters-container', className)}>
        {children}
      </div>
    );
  }

  // No mobile, usa o Sheet (modal) para exibir os filtros
  return (
    <Sheet open={ctrl.visible} onOpenChange={(open) => !open && ctrl.handleClose()}>
      <SheetContent 
        side="bottom" 
        className="h-[90vh] flex flex-col"
      >
        <SheetHeader>
          <SheetTitle>{ctrl.title}</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>

        {onSubmit && (
          <SheetFooter className="p-4">
            <Button
              onClick={ctrl.handleSubmit}
              disabled={ctrl.submitButtonDisabled}
              className="w-full"
              size="lg"
            >
              {ctrl.submitButtonText}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
} 