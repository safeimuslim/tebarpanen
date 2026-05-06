import { cn } from "@/lib/utils"

export function DetailMetric({
  badgeLabel,
  badgeVariant,
  label,
  value,
  valueClassName,
}: {
  badgeLabel?: string
  badgeVariant?: "income" | "expense"
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div>
      <dt className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted-foreground">{label}</span>
        {badgeLabel ? (
          <span
            className={cn(
              "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
              badgeVariant === "income"
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {badgeLabel}
          </span>
        ) : null}
      </dt>
      <dd className={cn("mt-1 font-medium", valueClassName)}>{value}</dd>
    </div>
  )
}

export function SummaryMetricRow({
  badgeLabel,
  badgeVariant,
  label,
  value,
  valueClassName,
}: {
  badgeLabel?: string
  badgeVariant?: "income" | "expense"
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="border-border bg-background flex items-start justify-between gap-4 rounded-md border px-3 py-2.5">
      <div className="min-w-0 space-y-1">
        <dt className="text-muted-foreground text-xs">{label}</dt>
        {badgeLabel ? (
          <span
            className={cn(
              "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
              badgeVariant === "income"
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {badgeLabel}
          </span>
        ) : null}
      </div>
      <dd className={cn("text-right font-medium", valueClassName)}>{value}</dd>
    </div>
  )
}
