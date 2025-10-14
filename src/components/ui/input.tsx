import React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";
import { useFormField } from "@devesharp/react-hooks-v2";
import { applyMask, removeMask, MaskType } from "@/utils/masks";
import { InputPrice } from "./input-price";

function Input({
  className,
  type,
  mask,
  prefix,
  suffix,
  title,
  ...props
}: Omit<React.ComponentProps<"input">, "prefix" | "suffix" | "title"> & {
  title?: string | React.ReactNode;
  name?: string | undefined;
  mask?: MaskType;
  suffix?: React.ReactNode | string;
  prefix?: React.ReactNode | string;
  error?: string;
  onInputTextChange?: (value: string) => void;
}) {

  const { value, setValue, error } = useFormField(props.name ?? "", "");
  const isFormContext = !!setValue && !!props.name;
  const errorMessage = props.error ?? error;

  // Estado interno para controlar o valor com máscara - sempre inicializado
  const [displayValue, setDisplayValue] = React.useState("");

  // Sincroniza o valor inicial e mudanças externas - sempre executado
  React.useEffect(() => {
    if (mask && value) {
      setDisplayValue(applyMask(String(value), mask));
    } else {
      setDisplayValue(String(value || ""));
    }
  }, [value, mask]);

  // Função para lidar com mudanças no input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (mask) {
      // Aplica a máscara ao valor digitado
      const maskedValue = applyMask(inputValue, mask);
      setDisplayValue(maskedValue);

      props.onInputTextChange?.(maskedValue);

      // Se estiver usando form context, salva o valor sem máscara
      if (isFormContext) {
        const cleanValue = removeMask(maskedValue, mask);
        setValue(cleanValue);
      }
    } else {
      props.onInputTextChange?.(inputValue);
      // Sem máscara, comportamento normal
      setDisplayValue(inputValue);
      if (isFormContext) {
        setValue(inputValue);
      }
    }
  };

  return (
    <div className={cn(className)}>
      {title && (
        <Label htmlFor={props.name} className="text-sm font-medium text-label">
          {title}
        </Label>
      )}
      <div
        className={cn(
            "file:text-foreground border-input-dark placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input flex h-10 w-full min-w-0 border bg-white rounded-[5px] text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm items-center justify-center",
            props.disabled && "pointer-events-none cursor-not-allowed opacity-50",
            "focus-within:border-primary",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            !!errorMessage && "border-red-500",
            className
        )}
      >
        {prefix && (
          <span className="text-sm pl-2">{prefix}</span>
        )}
        <input
          type={type}
          value={displayValue}
          onChange={handleChange}
          className="w-full h-full flex-1 px-3 py-1 focus:outline-none"
          {...props}
        />
        {suffix && <span className="text-sm text-label px-2">{suffix}</span>}
      </div>
      {!!errorMessage && (
        <p className="text-sm text-destructive text-error">{errorMessage}</p>
      )}
    </div>
  );
}
Input.displayName = "Input";

export { Input };
