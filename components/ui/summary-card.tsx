import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { Card, CardContent } from "./card"

type SummaryCardProps = {
  className?: string
  contentClassName?: string
  label: ReactNode
  labelAccessory?: ReactNode
  labelClassName?: string
  value: ReactNode
  valueClassName?: string
}

export function SummaryCard({
  className,
  contentClassName,
  label,
  labelAccessory,
  labelClassName,
  value,
  valueClassName,
}: SummaryCardProps) {
  return (
    <Card className={className}>
      <CardContent className={cn("pt-4", contentClassName)}>
        <div className="flex items-center gap-1.5">
          <p className={cn("text-muted-foreground text-sm", labelClassName)}>
            {label}
          </p>
          {labelAccessory}
        </div>
        <p className={cn("mt-2 text-2xl font-semibold", valueClassName)}>{value}</p>
      </CardContent>
    </Card>
  )
}
