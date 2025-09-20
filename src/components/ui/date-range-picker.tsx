"use client"

import * as React from "react"
import { CalendarIcon, X } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  className?: string
  placeholder?: string
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
  placeholder = "Selecione o período",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(date)

  // Atualizar tempDate quando date muda (externamente)
  React.useEffect(() => {
    setTempDate(date)
  }, [date])

  const formatDateRange = (dateRange: DateRange | undefined) => {
    if (!dateRange?.from) return placeholder

    if (dateRange.to) {
      return `${dateRange.from.toLocaleDateString('pt-BR')} - ${dateRange.to.toLocaleDateString('pt-BR')}`
    }

    return dateRange.from.toLocaleDateString('pt-BR')
  }

  // Para debugging - mostrar o que está sendo exibido
  const displayedDate = React.useMemo(() => formatDateRange(date), [date, placeholder])

  const hasChanges = React.useMemo(() => {
    const tempStr = JSON.stringify(tempDate)
    const dateStr = JSON.stringify(date)
    return tempStr !== dateStr
  }, [tempDate, date])

  const handleApply = () => {
    onDateChange?.(tempDate)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempDate(date)
    setIsOpen(false)
  }

  const handleClear = () => {
    setTempDate(undefined)
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIsOpen(true)
    } else if (!hasChanges) {
      setIsOpen(false)
    } else {
      // Se fechando com mudanças não salvas, reverte as mudanças
      setTempDate(date)
      setIsOpen(false)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayedDate}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={tempDate}
            onSelect={(newDate) => setTempDate(newDate)}
            numberOfMonths={2}
          />
          <div className="p-3 border-t border-border flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={tempDate === undefined}
            >
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              disabled={!hasChanges}
            >
              Aplicar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
