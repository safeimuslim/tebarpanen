import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function HighlightCard({
  description,
  label,
  value,
}: {
  description: string
  label: string
  value: string
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/12 bg-white/10 px-4 py-4">
      <p className="text-sm text-white/74">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm leading-6 text-white/78">{description}</p>
    </div>
  )
}

export function EmptyState({
  action,
  description,
  title,
}: {
  action?: ReactNode
  description: string
  title: string
}) {
  return (
    <div className="rounded-[1.5rem] border border-[#d9e9e4] bg-[#fbfdfd] px-4 py-8 text-center">
      <p className="font-medium text-[#163042]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[#5b7483]">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export function MetricRow({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="rounded-xl border border-[#d9e9e4] bg-white px-3 py-3">
      <dt className="text-xs text-[#6f8792]">{label}</dt>
      <dd className={cn("mt-1 font-medium text-[#163042]", valueClassName)}>
        {value}
      </dd>
    </div>
  )
}
