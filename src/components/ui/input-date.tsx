import React, { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";
import { useFormField } from "@devesharp/react-hooks-v2";
import { applyMask, removeMask, MaskType } from "@/utils/masks";
import { InputPrice } from "./input-price";
import {
  isValid,
  parse,
  format as formatDateFns,
  isAfter,
  isBefore,
} from "date-fns";
import { Input } from "./input";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Matcher } from "react-day-picker";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

function InputDate({
  className,
  type,
  title,
  format = "dd/MM/yyyy",
  ...props
}: Omit<React.ComponentProps<"input">, "prefix" | "suffix" | "title"> & {
  title?: string | React.ReactNode;
  name?: string | undefined;
  disabledRangeDate?: Matcher | Matcher[];
  format?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [month, setMonth] = React.useState<Date | undefined>(date);

  const { value, setValue, error } = useFormField<string>(
    props.name ?? "",
    false
  );
  const isFormContext = !!setValue && !!props.name;
  const errorMessage = error;
  const [valueInput, setValueInput] = useState<string>("");

  useEffect(() => {
    if (!!value && isFormContext) {
      try {
        const date = parse(value, format, new Date());
        setDate(parse(value, format, new Date()));
        setMonth(parse(value, format, new Date()));
        setValueInput(formatDateFns(date, format));
      } catch (error) {
        console.log("error", error);
      }
    }
  }, [value, isFormContext]);

  function onBlur() {
    let dateString = valueInput;

    let regex = /^\d{2}\/\d{2}\/\d{2}$/;

    // Se colocar apenas dois digitos, adiciona 20 no ano
    if (regex.test(dateString)) {
      dateString = dateString.replace(/\//g, "");
      dateString =
        dateString.slice(0, 2) +
        "/" +
        dateString.slice(2, 4) +
        "/20" +
        dateString.slice(4, 6);
    }

    regex = /^\d{2}\/\d{2}/;
    // Se colocar apenas dois digitos, adiciona 20 no ano
    if (regex.test(dateString)) {
      dateString = dateString.replace(/\//g, "");
      dateString =
        dateString.slice(0, 2) +
        "/" +
        dateString.slice(2, 4) +
        "/" +
        new Date().getFullYear();
    }

    // Se colocar apenas dois digitos, adiciona 20 no ano
    if (dateString.length <= 2) {
      dateString = dateString.replace(/\//g, "");
      dateString =
        dateString +
        "/" +
        (new Date().getMonth() + 1) +
        "/" +
        new Date().getFullYear();
    }

    const parsedDate = parse(dateString, format, new Date());

    if (!isValid(parsedDate) || isBefore(parsedDate, new Date("1900-01-01"))) {
      setValueInput("");
      setValue("");
      setDate(new Date());
      setMonth(new Date());
    } else {
      setDate(parsedDate);
      setMonth(parsedDate);
      setValue(dateString);
    }
  }

  function onInputTextChange(value: string) {
    console.log("value", value);
    setValueInput(value);
    // setValue(value);
  }

  console.log(valueInput);
  

  // console.log(date);
  // console.log(month);

  return (
    <div className={cn(className)}>
      <Input
        title={title}
        mask={"date"}
        placeholder={format}
        value={valueInput}
        onInputTextChange={onInputTextChange}
        onBlur={onBlur}
        error={errorMessage}
        suffix={
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button id="date-picker" variant="ghost">
                  <CalendarIcon className="size-3.5" />
                  <span className="sr-only">Selecionar data</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={date}
                  month={month}
                  onMonthChange={setMonth}
                  onSelect={(date) => {
                    setDate(date);
                    setValueInput(formatDateFns(date ?? new Date(), format));
                    setValue?.(formatDateFns(date ?? new Date(), format));
                    setOpen(false);
                  }}
                  disabled={props.disabledRangeDate}
                  className="rounded-md border border-input shadow-md p-2"
                />
              </PopoverContent>
            </Popover>
          </div>
        }
      />
    </div>
  );
}
InputDate.displayName = "InputDate";

export { InputDate };
