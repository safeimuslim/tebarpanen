"use client"

import type { ComponentProps } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import type { FinanceTrendPoint } from "../queries"

const chartConfig = {
  netProfit: {
    color: "#E5A93D",
    label: "Laba Bersih",
  },
  operationalCost: {
    color: "#125E8A",
    label: "Biaya",
  },
  revenue: {
    color: "#0F9D8A",
    label: "Pendapatan",
  },
} satisfies ChartConfig

export function FinanceTrendChart({
  points,
}: {
  points: FinanceTrendPoint[]
}) {
  if (!points.length) {
    return (
      <div className="border-border bg-background rounded-md border px-4 py-8 text-center text-sm text-muted-foreground">
        Belum ada data untuk periode yang dipilih.
      </div>
    )
  }

  return (
    <ChartContainer className="min-h-[280px] min-w-0 w-full" config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={points}
        margin={{ left: 12, right: 12, top: 8 }}
        responsive
        style={{ height: "280px", width: "100%" }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="label"
          tickLine={false}
          tickMargin={10}
        />
        <YAxis
          axisLine={false}
          tickFormatter={formatCompactCurrency}
          tickLine={false}
          tickMargin={10}
          width={80}
        />
        <ChartTooltip
          content={(props) => (
            <ChartTooltipContent {...(props as ComponentProps<typeof ChartTooltipContent>)} indicator="line" />
          )}
          cursor={false}
        />
        <ChartLegend
          content={(props) => (
            <ChartLegendContent {...(props as ComponentProps<typeof ChartLegendContent>)} />
          )}
        />
        <Line
          dataKey="revenue"
          dot={{
            fill: "var(--color-revenue)",
            r: 4,
            strokeWidth: 0,
          }}
          stroke="var(--color-revenue)"
          strokeWidth={3}
          type="monotone"
        />
        <Line
          dataKey="operationalCost"
          dot={{
            fill: "var(--color-operationalCost)",
            r: 4,
            strokeWidth: 0,
          }}
          stroke="var(--color-operationalCost)"
          strokeWidth={3}
          type="monotone"
        />
        <Line
          dataKey="netProfit"
          dot={{
            fill: "var(--color-netProfit)",
            r: 4,
            strokeWidth: 0,
          }}
          stroke="var(--color-netProfit)"
          strokeWidth={3}
          type="monotone"
        />
      </LineChart>
    </ChartContainer>
  )
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    notation: "compact",
    style: "currency",
  }).format(value)
}
