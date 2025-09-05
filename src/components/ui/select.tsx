"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { cn } from "@/lib/utils";
import { Label } from "./label";
import { useEffect, useRef, useState } from "react";
import { useFormField } from "@devesharp/react-hooks-v2";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface ISelectOption {
  /** Valor da opção */
  value: string | null;
  /** Label exibido para o usuário */
  label: string;
}

/**
 * Componente Select com virtualização automática para listas grandes
 *
 * @param virtualizeThreshold - Número mínimo de opções para ativar virtualização (padrão: 50)
 * @param estimateSize - Tamanho estimado de cada item em pixels (padrão: 35)
 *
 * Funcionalidades:
 * - Virtualização automática quando há muitas opções
 * - Performance otimizada para listas grandes (>50 itens)
 * - Scroll suave e responsivo
 * - Compatível com formulários (react-hook-form)
 * - Integração com useFormField
 *
 * Exemplo de uso:
 * ```tsx
 * <Select
 *   options={manyOptions}
 *   virtualizeThreshold={100} // Ativa virtualização com 100+ itens
 *   estimateSize={40} // Cada item tem ~40px de altura
 * />
 * ```
 */
function Select({
  virtualizeThreshold = 50,
  estimateSize = 32,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root> & {
  title?: string;
  options: ISelectOption[];
  name?: string | undefined;
  /** Número mínimo de opções para ativar virtualização */
  virtualizeThreshold?: number;
  /** Tamanho estimado de cada item em pixels */
  estimateSize?: number;
}) {
  const { title, options, ...rest } = props;
  const { value, setValue, error } = useFormField(props.name ?? "", "");
  const [selectedValue, setSelectedValue] = useState<string>(props.value ?? value);
  const isFormContext = !!setValue && !!props.name;
  const errorMessage = error;

  useEffect(() => {
    if (isFormContext) {
      setSelectedValue(value);
    }
  }, [isFormContext, value]);

  useEffect(() => {
    if (props.value !== undefined) {
      setSelectedValue(props.value);
    }
  }, [props.value]);

  // Filtrar opções com valor não nulo para o SelectItem
  const validOptions = options;
  const shouldVirtualize = validOptions.length > virtualizeThreshold;

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    setValue?.(newValue);
    props.onValueChange?.(newValue);
  };

  return (
    <div>
      {title && (
        <Label htmlFor={title} className="text-sm font-medium text-label">
          {title}
        </Label>
      )}

      {shouldVirtualize ? (
        <VirtualizedSelect
          options={validOptions}
          value={selectedValue}
          onValueChange={handleValueChange}
          estimateSize={estimateSize}
          error={!!error}
          {...rest}
        />
      ) : (
        <SelectBase
          value={selectedValue?.toString?.()}
          onValueChange={handleValueChange}
          {...rest}
        >
          <SelectTrigger className={error ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecione uma opção" />
          </SelectTrigger>
          <SelectContent>
            {validOptions.map((option) => (
              <SelectItem key={option.value} value={option.value!}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectBase>
      )}

      {!!errorMessage && (
        <p className="text-sm text-destructive text-error">{errorMessage}</p>
      )}
    </div>
  );
}

/**
 * Componente Select virtualizado que usa Popover em vez de SelectContent
 * para evitar conflitos com a estrutura do Radix UI Select
 */
function VirtualizedSelect({
  options,
  value,
  onValueChange,
  estimateSize,
  error = false,
  disabled = false,
  placeholder = "Selecione uma opção",
  ...props
}: {
  options: ISelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  estimateSize: number;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "border-input-dark data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:hover:bg-input/50 flex items-center justify-between gap-2 rounded-[5px] border-1 px-3 py-2 text-sm whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 h-10 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 w-full bg-white dark:bg-input",
            error && "border-destructive",
            open && "ring-2 ring-ring ring-offset-2"
          )}
        >
          <span className={cn("block truncate", !selectedOption && "text-muted-foreground")}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDownIcon className="size-4 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        sideOffset={4}
      >
        <VirtualizedSelectOptions
          open={open}
          options={options}
          estimateSize={estimateSize}
          selectedValue={value}
          onValueChange={(newValue) => {
            onValueChange(newValue);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

/**
 * Componente interno para renderização virtualizada das opções
 * Utiliza @tanstack/react-virtual para performance otimizada
 */
function VirtualizedSelectOptions({
  options,
  open,
  estimateSize,
  selectedValue,
  onValueChange,
}: {
  options: ISelectOption[];
  open: boolean;
  estimateSize: number;
  selectedValue: string | null;
  onValueChange: (value: string) => void;
  }) {
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 10, // Renderiza 10 itens extras fora da viewport para scroll suave
  });

  useEffect(() => {
    if (open && selectedValue) {
      const selectedIndex = options.findIndex((option) => option.value === selectedValue);
      if (selectedIndex >= 0) {
        setTimeout(() => {
          virtualizer.scrollToIndex(selectedIndex, {
            align: 'center'
          });
        }, 0);
      }
    }
  }, [open, selectedValue, options, virtualizer]);

  return (
    <div
      ref={parentRef}
      className="h-[200px] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      style={{
        contain: "strict", // Otimização de performance CSS
        WebkitOverflowScrolling: "touch", // Scroll suave no iOS
        overscrollBehavior: "contain", // Previne scroll do body
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const option = options[virtualItem.index];
          const isSelected = option.value === selectedValue;
          
          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
                              <div
                 role="option"
                 aria-selected={isSelected}
                 className={cn(
                   "relative flex w-full cursor-pointer items-center gap-2 py-1.5 pr-8 pl-2 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                   isSelected && "bg-accent text-accent-foreground"
                 )}
                 onClick={(e) => {
                   e.stopPropagation();
                   onValueChange(option.value!);
                 }}
                 onMouseDown={(e) => {
                   // Previne que o mousedown interfira com o scroll
                   e.stopPropagation();
                 }}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' || e.key === ' ') {
                     e.preventDefault();
                     onValueChange(option.value!);
                   }
                 }}
                 tabIndex={0}
               >
                <span className="block truncate">{option.label}</span>
                {isSelected && (
                  <span className="absolute right-2 flex size-3.5 items-center justify-center">
                    <CheckIcon className="size-4" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SelectBase({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input-dark data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:hover:bg-input/50 flex items-center justify-between gap-2 rounded-[5px] border-1 px-3 py-2 text-sm whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-10 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 w-full bg-white dark:bg-input",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden rounded-md border shadow-md overflow-y-auto",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectBase,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
