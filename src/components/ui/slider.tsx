"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";
import { Label } from "./label";
import { useFormField } from "@devesharp/react-hooks-v2";

function Slider({
  name,
  title,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  name?: string;
  title: string;
}) {
  const { value, setValue, error } = useFormField<number>(name ?? "", 0);
  const isFormContext = !!setValue && !!name;
  const errorMessage = error;

  return (
    <div>
      {!!title && (
        <Label htmlFor={name} className="text-sm font-medium text-label">
          {title}
        </Label>
      )}
      <div className="flex items-center gap-2 h-10">
        <div className="flex-1">
          <SliderBase
            {...props}
            {...(isFormContext
              ? {
                  value: [value],
                  onValueChange: (value: number[]) => {
                    setValue(value[0]);
                  },
                }
              : {})}
          />
        </div>
        <div>{value}%</div>
      </div>
    </div>
  );
}

function SliderBase({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
