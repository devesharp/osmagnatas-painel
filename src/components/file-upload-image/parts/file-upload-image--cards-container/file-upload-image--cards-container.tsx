import React from "react";
import { cn } from "@/lib/utils";
import { FileUploadImageCardsContainerProps } from "./file-upload-image--cards-container.types";
import { FileUploadImageCardsContainerCtrl } from "./file-upload-image--cards-container.ctrl";
import { FileUploadImageCard } from '../file-upload-image--card';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImageUpload } from "../../file-upload-image.types";

/**
 * Componente FileUploadImage-CardsContainer
 * 
 * Exemplo de uso:
 * ```tsx
 * <FileUploadImage-CardsContainer
 *   // props aqui
 * />
 * ```
 */

// Componente wrapper para cada card sortable
function SortableCard({ image, onRemove, onRetry, hasUploadFunction, disabledDelete }: {
  image: ImageUpload;
  onRemove: (id: string) => void;
  onRetry?: (id: string) => void;
  hasUploadFunction?: boolean;
  disabledDelete?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id, disabled: image.status != 'success' });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <FileUploadImageCard
        image={image}
        onRemove={onRemove}
        onRetry={onRetry}
        hasUploadFunction={hasUploadFunction}
        disabledDelete={disabledDelete}
      />
    </div>
  );
}

export function FileUploadImageCardsContainer(props: FileUploadImageCardsContainerProps) {
  const { className, images, disableDragAndDrop } = props;
  const ctrl = FileUploadImageCardsContainerCtrl(props);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 15,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (ctrl.isEmpty) {
    return null;
  }

  return (
    <DndContext
      sensors={disableDragAndDrop ? [] : sensors}
      collisionDetection={closestCenter}
      onDragEnd={ctrl.handleDragEnd}
    >
      <SortableContext
        items={images.map(img => img.id)}
        strategy={rectSortingStrategy}
      >
        <div className={cn(
          'grid gap-4 grid-cols-5 max-[370px]:grid-cols-2 max-[600px]:grid-cols-3 max-[850px]:grid-cols-4',
          className
        )}>
          {images.map((image) => (
            <SortableCard
              key={image.id}
              image={image}
              onRemove={ctrl.handleRemove}
              onRetry={ctrl.handleRetry}
              hasUploadFunction={ctrl.hasUploadFunction}
              disabledDelete={props.disabledDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
