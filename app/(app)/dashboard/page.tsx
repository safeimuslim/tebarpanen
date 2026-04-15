import Link from "next/link"
import type { ReactNode } from "react"
import {
  AlertTriangle,
  CalendarDays,
  Fish,
  FlaskConical,
  Package,
  TrendingDown,
  Waves,
  type LucideIcon,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { getDashboardPageData } from "./queries"

export default async function Dashboard() {
  const data = await getDashboardPageData()

  const summaryCards: Array<{
    icon: LucideIcon
    iconClassName: string
    label: string
    value: string
    valueClassName?: string
  }> = [
    {
      icon: Waves,
      iconClassName: "bg-[#125E8A]/12 text-[#125E8A]",
      label: "Kolam Aktif",
      value: formatNumber(data.activePondsCount),
    },
    {
      icon: Package,
      iconClassName: "bg-primary/12 text-primary",
      label: "Siklus Aktif",
      value: formatNumber(data.activeCyclesCount),
    },
    {
      icon: Fish,
      iconClassName: "bg-[#E5A93D]/15 text-[#A87412]",
      label: "Estimasi Ikan Hidup",
      value: formatNumber(data.totalEstimatedAlive),
    },
    {
      icon: CalendarDays,
      iconClassName:
        data.nearestHarvestDaysLeft != null && data.nearestHarvestDaysLeft <= 7
          ? "bg-primary/12 text-primary"
          : "bg-muted text-muted-foreground",
      label: "Panen Terdekat",
      value:
        data.nearestHarvestDaysLeft != null
          ? `${formatNumber(data.nearestHarvestDaysLeft)} hari lagi`
          : "-",
      valueClassName:
        data.nearestHarvestDaysLeft != null && data.nearestHarvestDaysLeft <= 7
          ? "text-primary"
          : undefined,
    },
  ]

  const visibleCycles = data.activeCycles.slice(0, 4)

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Prioritas operasional hari ini
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Ringkasan singkat kondisi {data.farmLabel.toLowerCase()} untuk membantu
            menentukan tindakan yang perlu dikerjakan lebih dulu.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            className="border-border bg-card rounded-lg border p-4"
            key={card.label}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg",
                  card.iconClassName
                )}
              >
                <card.icon className="size-5" />
              </div>
              <p className="text-muted-foreground pt-1 text-sm">{card.label}</p>
            </div>
            <p className={cn("mt-2 text-2xl font-semibold", card.valueClassName)}>
              {card.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(19rem,0.9fr)]">
        <div className="border-border bg-card rounded-lg border p-5">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Perlu Dikerjakan Hari Ini</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Fokus pada catatan yang paling berpengaruh ke operasional harian.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {data.alerts.length ? (
              data.alerts.map((alert) => {
                const Icon = getAlertIcon(alert.type)

                return (
                  <div
                    className="border-border bg-background flex items-start gap-3 rounded-md border px-3 py-3"
                    key={`${alert.type}-${alert.cycleId ?? alert.label}`}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md",
                        alert.tone === "danger"
                          ? "bg-destructive/10 text-destructive"
                          : alert.tone === "warning"
                            ? "bg-[#E5A93D]/12 text-[#B07B18]"
                            : "bg-primary/12 text-primary"
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">{alert.label}</p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <EmptyState
                description="Input operasional hari ini sudah cukup lengkap pada seluruh siklus aktif."
                title="Tidak ada catatan yang perlu ditindaklanjuti"
              />
            )}
          </div>
        </div>

        <div className="border-border bg-card rounded-lg border p-5">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <Fish className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Panen Terdekat</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Siklus yang jadwal panennya paling dekat dari hari ini.
              </p>
            </div>
          </div>

          <div className="mt-5">
            {data.nearestHarvest ? (
              <div className="border-border bg-background rounded-md border p-4">
                <p className="font-semibold">{data.nearestHarvest.cycleName}</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {data.nearestHarvest.pondsLabel}
                </p>

                <dl className="mt-4 space-y-3 text-sm">
                  <MetricRow
                    label="Target Panen"
                    value={formatDate(data.nearestHarvest.targetHarvestDate)}
                  />
                  <MetricRow
                    label="Sisa Waktu"
                    value={`${formatNumber(data.nearestHarvest.daysLeft)} hari`}
                    valueClassName={
                      data.nearestHarvest.daysLeft <= 7 ? "text-primary" : undefined
                    }
                  />
                </dl>

                <div className="mt-4">
                  <Link
                    className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-2")}
                    href={data.nearestHarvest.href}
                  >
                    Lihat Detail Siklus
                  </Link>
                </div>
              </div>
            ) : (
              <EmptyState
                description="Atur target panen pada siklus aktif agar jadwal panen bisa dipantau dari dashboard."
                title="Belum ada target panen"
              />
            )}
          </div>
        </div>
      </section>

      <section className="border-border bg-card rounded-lg border p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-semibold">Siklus Aktif</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Daftar singkat siklus yang sedang berjalan dan perlu dipantau.
            </p>
          </div>

          {data.activeCycles.length ? (
            <Link
              className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-2")}
              href="/siklus-budidaya"
            >
              Lihat Semua Siklus
            </Link>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3">
          {visibleCycles.length ? (
            visibleCycles.map((cycle) => (
              <article
                className="border-border bg-background rounded-md border p-4"
                key={cycle.id}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-semibold">{cycle.name}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">{cycle.pondsLabel}</p>
                  </div>

                  <Link
                    className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-2")}
                    href={cycle.href}
                  >
                    Detail
                  </Link>
                </div>

                <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MetricRow
                    label="Umur"
                    value={`${formatNumber(cycle.ageDays)} hari`}
                  />
                  <MetricRow
                    label="Estimasi Hidup"
                    value={`${formatNumber(cycle.aliveEstimate)} ekor`}
                  />
                  <MetricRow
                    label="Target Panen"
                    value={
                      cycle.targetHarvestDate
                        ? formatDate(cycle.targetHarvestDate)
                        : "Belum diatur"
                    }
                  />
                </dl>
              </article>
            ))
          ) : (
            <EmptyState
              action={
                <Link className={buttonVariants({ variant: "outline" })} href="/siklus-budidaya">
                  Buka Siklus Budidaya
                </Link>
              }
              description="Tambahkan siklus budidaya baru untuk mulai mencatat operasional."
              title="Belum ada siklus aktif"
            />
          )}
        </div>
      </section>
    </div>
  )
}

function EmptyState({
  action,
  description,
  title,
}: {
  action?: ReactNode
  description: string
  title: string
}) {
  return (
    <div className="border-border bg-background rounded-md border px-4 py-8 text-center">
      <p className="font-medium">{title}</p>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

function MetricRow({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="border-border rounded-md border px-3 py-2.5">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className={cn("mt-1 font-medium", valueClassName)}>{value}</dd>
    </div>
  )
}

function getAlertIcon(type: "feed" | "harvest" | "mortality" | "water-quality") {
  switch (type) {
    case "feed":
      return Package
    case "water-quality":
      return FlaskConical
    case "mortality":
      return TrendingDown
    case "harvest":
      return Fish
  }
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value)
}
