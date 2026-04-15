"use client"

import * as React from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
const MIN_YEAR = 2020

export function MonthField({
  defaultValue,
  label,
  layout = "inline",
  name,
}: {
  defaultValue: string
  label: string
  layout?: "inline" | "stacked"
  name: string
}) {
  const initialDate = React.useMemo(() => parseMonthValue(defaultValue), [defaultValue])
  const [selectedMonth, setSelectedMonth] = React.useState<Date | undefined>(initialDate)
  const [displayYear, setDisplayYear] = React.useState(
    initialDate?.getFullYear() ?? new Date().getFullYear()
  )
  const [open, setOpen] = React.useState(false)
  const maxYear = new Date().getFullYear() + 5

  React.useEffect(() => {
    const parsedValue = parseMonthValue(defaultValue)
    setSelectedMonth(parsedValue)
    setDisplayYear(parsedValue?.getFullYear() ?? new Date().getFullYear())
  }, [defaultValue])

  return (
    <div
      className={cn(
        layout === "stacked" ? "space-y-2" : "flex items-center gap-3"
      )}
    >
      <label
        className={cn("text-sm font-medium", layout === "inline" && "shrink-0")}
        htmlFor={name}
      >
        {label}
      </label>

      <input name={name} type="hidden" value={formatMonthValue(selectedMonth)} />

      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger
          render={
            <Button
              className={cn(
                "h-10 justify-between border-input bg-white font-normal hover:bg-white",
                layout === "stacked" ? "w-full min-w-[11rem]" : "min-w-[11rem]"
              )}
              id={name}
              type="button"
              variant="outline"
            />
          }
        >
          <span className="truncate">
            {selectedMonth ? formatMonthLabel(selectedMonth) : "Pilih bulan"}
          </span>
          <CalendarIcon className="text-muted-foreground size-4 shrink-0" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[19rem] p-3" side="bottom">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <Button
                aria-label="Tahun sebelumnya"
                className="size-10"
                disabled={displayYear <= MIN_YEAR}
                onClick={() => setDisplayYear((currentYear) => currentYear - 1)}
                size="icon"
                type="button"
                variant="outline"
              >
                <ChevronLeft className="size-4" />
              </Button>

              <div className="text-center">
                <p className="text-sm font-medium">{displayYear}</p>
                <p className="text-muted-foreground text-xs">Pilih bulan</p>
              </div>

              <Button
                aria-label="Tahun berikutnya"
                className="size-10"
                disabled={displayYear >= maxYear}
                onClick={() => setDisplayYear((currentYear) => currentYear + 1)}
                size="icon"
                type="button"
                variant="outline"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {MONTH_LABELS.map((monthLabel, monthIndex) => {
                const monthDate = new Date(displayYear, monthIndex, 1)
                const isSelected =
                  selectedMonth?.getFullYear() === displayYear &&
                  selectedMonth.getMonth() === monthIndex

                return (
                  <Button
                    className={cn(
                      "h-10 justify-center font-normal",
                      isSelected && "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    )}
                    key={monthLabel}
                    onClick={() => {
                      setSelectedMonth(monthDate)
                      setDisplayYear(displayYear)
                      setOpen(false)
                    }}
                    type="button"
                    variant={isSelected ? "outline" : "outline"}
                  >
                    {monthLabel}
                  </Button>
                )
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function parseMonthValue(value: string) {
  if (!value) {
    return undefined
  }

  const [yearRaw, monthRaw] = value.split("-")
  const year = Number(yearRaw)
  const month = Number(monthRaw)

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return undefined
  }

  return new Date(year, month - 1, 1)
}

function formatMonthValue(value?: Date) {
  if (!value) {
    return ""
  }

  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

function formatMonthLabel(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(value)
}
