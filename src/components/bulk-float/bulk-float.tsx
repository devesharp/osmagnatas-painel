"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BulkFloatProps } from "./bulk-float.types";
import { useBulkFloatCtrl } from "./bulk-float.ctrl";

export function BulkFloat(props: BulkFloatProps) {
  const { className } = props;
  const ctrl = useBulkFloatCtrl(props);

  // Se não há itens selecionados, não renderizar o componente
  if (!ctrl.hasSelectedItems) {
    return null;
  }

  return (
    <div
      ref={ctrl.bulkFloatRef}
      className={cn(
        "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50",
        "bg-bulk-float rounded-lg shadow-lg",
        "flex items-center gap-3 px-4 py-3 min-w-fit max-w-[calc(100vw-2rem)]",
        "animate-in slide-in-from-bottom-2 duration-300",
        className
      )}
    >
      {/* Contador de itens selecionados */}
      <div className="flex items-center gap-2 text-sm font-medium text-foreground whitespace-nowrap">
        {ctrl.showOnlyIcons && <span>{ctrl.selectedCount} item{ctrl.selectedCount !== 1 ? "s" : ""}{" "}</span>}
        {!ctrl.showOnlyIcons && (
          <span>
            {ctrl.selectedCount} item{ctrl.selectedCount !== 1 ? "s" : ""}{" "}
            selecionado{ctrl.selectedCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Separador */}
      <div className="w-px h-6 bg-border" />

      {/* Container das ações */}
      <div className="flex items-center gap-2 overflow-hidden">
        {props.actions.map((action, index) => (
          <div key={index}>
            {ctrl.showOnlyIcons && action.icon ? (
              // Modo responsivo: apenas ícone com tooltip
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => ctrl.handleActionClick(action)}
                    className="h-8 w-8 p-0"
                  >
                    {action.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.title}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              // Modo normal: ícone + texto
              <Button
                variant="ghost"
                size="sm"
                onClick={() => ctrl.handleActionClick(action)}
                className="h-8 px-3 gap-2"
              >
                {action.icon && (
                  <span className="flex-shrink-0">{action.icon}</span>
                )}
                <span className="whitespace-nowrap">{action.title}</span>
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Separador */}
      <div className="w-px h-6 bg-border" />

      {/* Botão para limpar seleção */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={ctrl.handleClearSelection}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Limpar seleção</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
