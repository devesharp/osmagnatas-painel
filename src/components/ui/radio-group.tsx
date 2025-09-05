"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "./label";
import { useFormField } from "@devesharp/react-hooks-v2";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  title?: string;
  options: { label: string; value: string | null }[];
}) {
  const { title, options } = props;
  const {value, setValue, error} = useFormField(props.name ?? "", "")
  const isFormContext = !!setValue && !!props.name;
  const errorMessage = error;
  
  return (
    <div>
      {title && (
        <Label htmlFor={title} className="text-sm font-medium text-label">
          {title}
        </Label>
      )}
      <RadioGroupBase
        data-slot="radio-group"
        className={cn("grid gap-3", className)}
        {...props}
        {...(isFormContext
          ? {
              value: value != null ? value.toString() : undefined,
              onValueChange: (value: string) => setValue(value),
            }
          : {})}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value ?? ""} id={option.value ?? ""} />
            <Label htmlFor={option.value ?? ""} className="cursor-pointer hover:text-primary">{option.label}</Label>
          </div>
        ))}
      </RadioGroupBase>

      {!!errorMessage && (
        <p className="text-sm text-destructive text-error">{errorMessage}</p>
      )}
    </div>
  );
}

function RadioGroupBase({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-input-dark text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary bg-white",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupBase, RadioGroupItem };
