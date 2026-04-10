import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CycleDetailTab = "ringkasan" | "pakan" | "mortalitas" | "sampling"

export function CycleDetailTabs({
  activeTab,
  counts,
  cycleId,
}: {
  activeTab: CycleDetailTab
  counts: {
    feedLogs: number
    mortalityLogs: number
    samplingLogs: number
  }
  cycleId: string
}) {
  const tabs: Array<{
    label: string
    value: CycleDetailTab
    count?: number
  }> = [
    { label: "Ringkasan", value: "ringkasan" },
    { label: "Pakan", value: "pakan", count: counts.feedLogs },
    { label: "Mortalitas", value: "mortalitas", count: counts.mortalityLogs },
    { label: "Sampling", value: "sampling", count: counts.samplingLogs },
  ]

  return (
    <div className="flex gap-2 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab
        const href =
          tab.value === "ringkasan"
            ? `/siklus-budidaya/${cycleId}`
            : `/siklus-budidaya/${cycleId}?tab=${tab.value}`

        return (
          <Link
            className={cn(
              buttonVariants({ variant: isActive ? "default" : "ghost" }),
              "shrink-0 gap-2 rounded-md px-4",
              !isActive && "text-muted-foreground"
            )}
            href={href}
            key={tab.value}
            scroll={false}
          >
            <span>{tab.label}</span>
            {tab.count != null ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs",
                  isActive
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                {tab.count}
              </span>
            ) : null}
          </Link>
        )
      })}
    </div>
  )
}
