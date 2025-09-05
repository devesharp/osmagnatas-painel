"use client";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useFormField } from "@devesharp/react-hooks-v2";
import { cn } from "@/lib/utils";
import { Label } from "./label";

type TextInputProps = {
  name?: string;
  title?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: number) => void;
};

// Brazilian currency formatter
const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  currencyDisplay: "symbol",
  currencySign: "standard",
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function InputPrice(
  props: React.ComponentProps<"input"> & TextInputProps
) {

  const {value: formValue, setValue: setFormValue, error: formError} = useFormField<number | string>(props.name ?? "", "")
  const isFormContext = !!setFormValue && !!props.name;
  const errorMessage = formError;

  const [value, setValue] = useState<number | null>(null);
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value as number);
      setDisplayValue(formatValue(props.value));
    }
  }, [props.value]);

  useEffect(() => {
    if (formValue !== undefined) {
      setDisplayValue(formatValue(formValue));
    }
  }, [formValue]);

  function formatValue(value: string | number) {
    // Se for number, só formata
    if (typeof value === "number") {
      return moneyFormatter.format(value);
    }

    const cleanValue = value.replace(/\D/g, "");
    return moneyFormatter.format(Number(cleanValue) / 100);
  }

  function getRealNumber(value: string) {
    const cleanValue = value.replace(/\D/g, "");
    return Number(cleanValue) / 100;
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = event.target.value;

    props.onValueChange?.(getRealNumber(inputValue));
    
    if(isFormContext) {
      setFormValue(getRealNumber(inputValue));
      setDisplayValue(formatValue(inputValue));
      return;
    }

    if (props.value === undefined) {
      setValue(getRealNumber(inputValue));
      setDisplayValue(formatValue(inputValue));
    } else {
      props.onValueChange?.(getRealNumber(inputValue));
    }
  }

  return (
    <div className={cn(props.className)}>
      {props.title && (
        <Label htmlFor={props.name} className="text-sm font-medium text-label">
          {props.title}
        </Label>
      )}
      <input
        {...props}
        className={cn(
          "file:text-foreground border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input flex h-10 w-full min-w-0 border bg-transparent rounded-[10px] px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-primary",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          !!errorMessage && "border-destructive"
        )}
        type="text"
        value={displayValue}
        maxLength={19}
        onChange={handleChange}
      />
      {!!errorMessage && (
        <p className="text-sm text-destructive text-error">{errorMessage}</p>
      )}
    </div>
  );
}
