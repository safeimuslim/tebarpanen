"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

export type ChartConfig = {
  [key: string]: {
    color?: string
    label?: React.ReactNode
  }
}

type ChartContextValue = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextValue | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("Chart components must be used within a ChartContainer.")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
  }
>(({ children, className, config, style, ...props }, ref) => {
  const chartStyle = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(config)
          .filter(([, value]) => value.color)
          .map(([key, value]) => [`--color-${key}`, value.color])
      ) as React.CSSProperties,
    [config]
  )

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-legend-item_text]:text-muted-foreground [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border min-w-0 text-xs",
          className
        )}
        data-slot="chart"
        ref={ref}
        style={{ ...chartStyle, ...style }}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipContent({
  active,
  className,
  hideIndicator = false,
  hideLabel = false,
  indicator = "dot",
  label,
  labelFormatter,
  payload,
}: RechartsPrimitive.TooltipContentProps<number, string> & {
    className?: string
    hideIndicator?: boolean
    hideLabel?: boolean
    indicator?: "dot" | "line"
    labelFormatter?: (label: React.ReactNode) => React.ReactNode
  }) {
  const { config } = useChart()

  if (!active || !payload?.length) {
    return null
  }

  const resolvedLabel = labelFormatter ? labelFormatter(label) : label

  return (
    <div
      className={cn(
        "border-border bg-background min-w-48 rounded-lg border px-3 py-2.5 text-sm shadow-md",
        className
      )}
    >
      {!hideLabel ? (
        <p className="text-foreground mb-2 font-medium">{resolvedLabel}</p>
      ) : null}
      <div className="space-y-1.5">
        {payload.map((item, index) => {
          const dataKey = String(item.dataKey ?? "")
          const itemConfig = config[dataKey]
          const value = typeof item.value === "number" ? formatCurrency(item.value) : item.value

          return (
            <div
              className="flex items-center justify-between gap-4"
              key={`${dataKey}-${index}`}
            >
              <div className="flex min-w-0 items-center gap-2">
                {!hideIndicator ? (
                  indicator === "line" ? (
                    <span
                      className="h-2.5 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  ) : (
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  )
                ) : null}
                <span className="text-muted-foreground truncate">
                  {itemConfig?.label ?? item.name}
                </span>
              </div>
              <span className="font-medium tabular-nums">{value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  payload,
}: {
  className?: string
  payload?: Array<{
    color?: string
    dataKey?: string | number
    value?: React.ReactNode
  }>
}) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-4 pt-2", className)}>
      {payload.map((item) => {
        const dataKey = String(item.dataKey ?? "")
        const itemConfig = config[dataKey]

        return (
          <div className="flex items-center gap-2" key={dataKey}>
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground text-xs">
              {itemConfig?.label ?? item.value}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value)
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
}
