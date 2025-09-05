"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
import { Label } from "./label";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { useFormField } from "@devesharp/react-hooks-v2";

function convertBoolean(value: boolean | string | undefined): boolean {
  if (typeof value === "string") {
    return value === "true" || value === "1";
  }
  return value ?? false;
}

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  title?: string;
  name?: string | undefined;
}) {
  // const { title } = props;
  const {value, setValue, error} = useFormField<boolean>(props.name ?? "", false)
  const isFormContext = !!setValue && !!props.name;
  const errorMessage = error;

  return (
    <div className="flex items-center space-x-2">
      <SwitchBase
        className={className}
        {...props}
        {...(isFormContext
          ? {
              checked: convertBoolean(value),
              onCheckedChange: (checked: boolean) => {
                props.onCheckedChange?.(checked);
                setValue(checked);
              }
            }
          : {})}
      />
      <Label
        htmlFor={props.id}
        className="text-sm font-medium text-label pb-0! cursor-pointer"
        onClick={() => {
          if(props.disabled) return;
          
          if (isFormContext) {
            setValue(!value);
            props.onCheckedChange?.(!value);
          } else {
            props.onCheckedChange?.(!props.checked);
          }
        }}
      >
        {props.title}
      </Label>
      {!!errorMessage && (
        <p className="text-sm text-destructive text-error">{errorMessage}</p>
      )}
    </div>
  );
}

function SwitchBase({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer hover:opacity-80",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
