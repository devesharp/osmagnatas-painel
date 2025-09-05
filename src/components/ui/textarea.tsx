import * as React from "react"
import { cn } from "@/lib/utils"
import { useFormField } from "@devesharp/react-hooks-v2";
import { Label } from "./label";
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {

  const { title } = props;

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
      <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-19 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
        props.disabled && "cursor-not-allowed opacity-50",
      )}
      disabled={props.disabled}
      {...(isFormContext
        ? { 
          value: value,
          onChange: (e) => setValue(e.target.value)
         }
        : {})}
    />

    {!!errorMessage && (
      <p className="text-sm text-destructive text-error">{errorMessage}</p>
    )}
    </div>
  )
}

export { Textarea }
