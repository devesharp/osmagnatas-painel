"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "./label";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { useFormField } from "@devesharp/react-hooks-v2";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  title?: string;
}) {
  const { title } = props;
  const {value, setValue, error} = useFormField(props.name ?? "", false)
  const isFormContext = !!setValue && !!props.name;
  const errorMessage = error;

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <CheckboxBase
        className={cn(className, "cursor-pointer")}
        name={title ?? props.name}
        {...props}
        {...(isFormContext
          ? {
              checked: value,
              onCheckedChange: (checked: boolean) =>
                setValue(checked),
            }
          : {})}
      />
      {title && (
        <Label
          htmlFor={title}
          className="text-sm font-medium text-label pb-0! cursor-pointer"
          onClick={() => {
            setValue(!value);
          }}
        >
          {title}
        </Label>
      )}

      {!!errorMessage && (
        <p className="text-sm text-destructive text-error">{errorMessage}</p>
      )}
    </div>
  );
}

function CheckboxBase({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input-dark data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 bg-white dark:bg-input",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
