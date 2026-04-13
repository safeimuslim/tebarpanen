import type { FinanceTrendPoint } from "../queries"

const SERIES = [
  { color: "#0F9D8A", key: "revenue", label: "Pendapatan" },
  { color: "#125E8A", key: "operationalCost", label: "Biaya" },
  { color: "#E5A93D", key: "netProfit", label: "Laba" },
] as const

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

  const width = 720
  const height = 280
  const paddingX = 44
  const paddingTop = 20
  const paddingBottom = 44
  const chartWidth = width - paddingX * 2
  const chartHeight = height - paddingTop - paddingBottom
  const values = points.flatMap((point) => [
    point.revenue,
    point.operationalCost,
    point.netProfit,
  ])
  const rawMin = Math.min(...values, 0)
  const rawMax = Math.max(...values, 0)
  const minValue = rawMin === rawMax ? rawMin - 1 : rawMin
  const maxValue = rawMin === rawMax ? rawMax + 1 : rawMax
  const xStep = points.length > 1 ? chartWidth / (points.length - 1) : 0
  const zeroY = getY(0, minValue, maxValue, chartHeight, paddingTop)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {SERIES.map((series) => (
          <div className="flex items-center gap-2 text-xs" key={series.key}>
            <span
              className="block size-2.5 rounded-full"
              style={{ backgroundColor: series.color }}
            />
            <span className="text-muted-foreground">{series.label}</span>
          </div>
        ))}
      </div>

      <div className="border-border bg-background rounded-md border p-3">
        <svg
          aria-label="Tren pendapatan, biaya, dan laba"
          className="h-auto w-full"
          viewBox={`0 0 ${width} ${height}`}
        >
          <line
            stroke="#D1D5DB"
            strokeDasharray="4 4"
            strokeWidth="1"
            x1={paddingX}
            x2={width - paddingX}
            y1={zeroY}
            y2={zeroY}
          />

          {[maxValue, 0, minValue]
            .filter((value, index, array) => array.indexOf(value) === index)
            .map((value) => {
              const y = getY(value, minValue, maxValue, chartHeight, paddingTop)
              return (
                <g key={value}>
                  <line
                    stroke="#E5E7EB"
                    strokeWidth="1"
                    x1={paddingX}
                    x2={width - paddingX}
                    y1={y}
                    y2={y}
                  />
                  <text
                    fill="#6B7280"
                    fontSize="11"
                    textAnchor="start"
                    x={0}
                    y={y + 4}
                  >
                    {formatCompactCurrency(value)}
                  </text>
                </g>
              )
            })}

          {SERIES.map((series) => {
            const polylinePoints = points
              .map((point, index) => {
                const x = paddingX + xStep * index
                const value = point[series.key]
                const y = getY(value, minValue, maxValue, chartHeight, paddingTop)
                return `${x},${y}`
              })
              .join(" ")

            return (
              <g key={series.key}>
                <polyline
                  fill="none"
                  points={polylinePoints}
                  stroke={series.color}
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {points.map((point, index) => {
                  const x = paddingX + xStep * index
                  const value = point[series.key]
                  const y = getY(value, minValue, maxValue, chartHeight, paddingTop)

                  return (
                    <circle
                      cx={x}
                      cy={y}
                      fill={series.color}
                      key={`${series.key}-${point.monthParam}`}
                      r="4"
                    />
                  )
                })}
              </g>
            )
          })}

          {points.map((point, index) => {
            const x = paddingX + xStep * index

            return (
              <text
                fill="#6B7280"
                fontSize="11"
                key={point.monthParam}
                textAnchor="middle"
                x={x}
                y={height - 14}
              >
                {point.label}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

function getY(
  value: number,
  minValue: number,
  maxValue: number,
  chartHeight: number,
  paddingTop: number
) {
  return paddingTop + ((maxValue - value) / (maxValue - minValue)) * chartHeight
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    notation: "compact",
    style: "currency",
  }).format(value)
}
