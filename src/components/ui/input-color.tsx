"use client";

import * as React from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { useFormField } from "@devesharp/react-hooks-v2";
import { useState, useEffect, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type InputColorProps = {
  name?: string;
  title?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

/**
 * Valida se uma cor hexadecimal é válida
 */
function isValidHexColor(color: string): boolean {
  // Remove o # se presente
  const cleanColor = color.replace("#", "");

  // Verifica se tem 3 ou 6 caracteres e se são todos hexadecimais
  return /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanColor);
}

/**
 * Normaliza uma cor hex para formato de 6 dígitos
 */
function normalizeHexColor(color: string): string {
  const cleanColor = color.replace("#", "").toUpperCase();

  // // Se tem 3 dígitos, expande para 6
  // if (cleanColor.length === 3) {
  //   cleanColor = cleanColor.split('').map(char => char + char).join('');
  // }

  return cleanColor;
}

function normalizeHexColor2(color: string): string {
  let cleanColor = color.replace("#", "").toUpperCase();

  // Se tem 3 dígitos, expande para 6
  if (cleanColor.length === 3) {
    cleanColor = cleanColor + cleanColor;
  } else if (cleanColor.length === 2) {
    cleanColor = cleanColor + cleanColor + cleanColor;
  }

  return cleanColor.padEnd(6, "0");
}

/**
 * Converte hex para formato que o react-colorful aceita (com #)
 */
function hexToColorful(hex: string): string {
  return `#${normalizeHexColor(hex)}`;
}

/**
 * Converte formato do react-colorful para hex (sem #)
 */
function colorfulToHex(color: string): string {
  return normalizeHexColor(color);
}

export function InputColor(props: InputColorProps) {
  const {
    value: formValue,
    setValue: setFormValue,
    error: formError,
  } = useFormField<string>(props.name ?? "", "");
  const isFormContext = !!setFormValue && !!props.name;
  const errorMessage = formError;

  // Estado interno para controlar o valor
  const [internalValue, setInternalValue] = useState<string>("000000");
  const [lastValidColor, setLastValidColor] = useState<string>("000000");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Inicializa com valor padrão
  useEffect(() => {
    const initialValue = props.value || formValue || "";
    if (initialValue) {
      const cleanValue = initialValue.replace("#", "");
      if (isValidHexColor(cleanValue)) {
        const normalizedColor = normalizeHexColor(cleanValue);
        setInternalValue(normalizedColor);
        setLastValidColor(normalizedColor);
      }
    } else {
      // Define uma cor padrão se não houver valor inicial
      setInternalValue("000000");
      setLastValidColor("000000");
    }
  }, [props.value, formValue]);

  // Sincroniza com mudanças externas
  useEffect(() => {
    if (props.value !== undefined) {
      const cleanValue = props.value.replace("#", "");
      if (isValidHexColor(cleanValue)) {
        const normalizedColor = normalizeHexColor(cleanValue);
        setInternalValue(normalizedColor);
        setLastValidColor(normalizedColor);
      }
    }
  }, [props.value]);

  useEffect(() => {
    if (isFormContext && formValue) {
      const cleanValue = formValue.replace("#", "");
      if (isValidHexColor(cleanValue)) {
        const normalizedColor = normalizeHexColor(cleanValue);
        setInternalValue(normalizedColor);
        setLastValidColor(normalizedColor);
      }
    }
  }, [formValue, isFormContext]);

  // Função para atualizar o valor
  const updateValue = (newValue: string) => {
    const cleanValue = newValue.replace("#", "");

    if (isValidHexColor(cleanValue)) {
      const normalizedColor = normalizeHexColor(cleanValue);
      setInternalValue(normalizedColor);
      setLastValidColor(normalizedColor);

      // Propaga a mudança
      if (isFormContext) {
        setFormValue(normalizedColor);
      }

      props.onValueChange?.(normalizedColor);

      // Simula evento onChange para compatibilidade
      if (props.onChange && inputRef.current) {
        const event = {
          target: { value: normalizedColor },
          currentTarget: inputRef.current,
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange(event);
      }
    } else {
      // Se a cor é inválida, reverte para a última cor válida
      setInternalValue(lastValidColor);
    }
  };

  // Handler para mudanças no input de texto
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    // Remove caracteres não hexadecimais durante a digitação
    const cleanInput = inputValue.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);

    // Atualiza o valor no input imediatamente (feedback visual)
    setInternalValue(cleanInput.toUpperCase());

    // Só valida e propaga se for uma cor válida
    if (isValidHexColor(cleanInput)) {
      updateValue(cleanInput);
    }
  };

  // Handler para mudanças no ColorPicker
  const handleColorPickerChange = (color: string) => {
    updateValue(color);
  };

  // Handler para quando o usuário sai do campo de texto
  const handleInputBlur = () => {
    // Se a cor atual não é válida, reverte para a última cor válida
    if (!isValidHexColor(normalizeHexColor2(internalValue))) {
      setInternalValue(lastValidColor);
    } else {
      updateValue(normalizeHexColor2(internalValue));
    }
  };

  // Valor atual formatado para exibição
  const displayValue = internalValue;
  const hexColor = `#${internalValue}`;

  return (
    <div className={cn(props.className)}>
      {props.title && (
        <Label htmlFor={props.name} className="text-sm font-medium text-label">
          {props.title}
        </Label>
      )}

      <div className="relative">
        <div
          className={cn(
            "border-input-dark placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input flex h-10 w-full min-w-0 border bg-white rounded-[5px] text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm items-center",
            "focus-within:border-primary",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            !!errorMessage && "border-destructive",
            props.disabled &&
              "pointer-events-none cursor-not-allowed opacity-50"
          )}
        >
          {/* ColorPicker como prefixo */}
          <div className="flex items-center pl-2">
            <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={props.disabled}
                  className="w-6 h-6 border-1 rounded border-input-dark cursor-pointer transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  style={{
                    backgroundColor: hexColor,
                  }}
                  aria-label="Abrir seletor de cores"
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <div>
                  <HexColorPicker
                    color={hexToColorful(internalValue)}
                    onChange={handleColorPickerChange}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <span className="ml-2 text-sm text-muted-foreground">#</span>
          </div>

          {/* Input de texto */}
          <input
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder={props.placeholder || "000000"}
            disabled={props.disabled}
            className="flex-1 h-full px-2 py-1 pl-1 focus:outline-none text-sm font-mono uppercase bg-transparent min-w-0"
            maxLength={6}
            style={{
              caretColor: hexColor,
            }}
            onPaste={(e) => {
              // Intercepta o paste para remover # se presente
              e.preventDefault();
              const pastedText = e.clipboardData.getData("text");
              const cleanText = pastedText.replace("#", "");
              updateValue(cleanText);
            }}
          />
        </div>
      </div>

      {!!errorMessage && (
        <p className="text-sm text-destructive text-error">{errorMessage}</p>
      )}
    </div>
  );
}
