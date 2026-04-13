import Link from "next/link"
import {
  AlertTriangle,
  Fish,
  FlaskConical,
  Package,
  TrendingDown,
  Waves,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { getDashboardPageData } from "./queries"

export default async function Dashboard() {
  const data = await getDashboardPageData()

  const summaryCards: Array<{
    helper: string
    label: string
    value: string
    valueClassName?: string
    valueSubtext?: string
  }> = [
    {
      helper: "Kolam yang sedang dipakai untuk operasional budidaya",
      label: "Kolam Aktif",
      value: formatNumber(data.activePondsCount),
    },
    {
      helper: "Siklus yang sedang berjalan dan belum selesai",
      label: "Siklus Aktif",
      value: formatNumber(data.activeCyclesCount),
    },
    {
      helper: "Estimasi ikan hidup dari seluruh siklus aktif",
      label: "Estimasi Ikan Hidup",
      value: formatNumber(data.totalEstimatedAlive),
    },
    {
      helper: "Akumulasi pakan yang sudah dicatat hari ini",
      label: "Pakan Hari Ini",
      value: `${formatNumber(data.feedTodayKg)} kg`,
    },
    {
      helper: "Jumlah ikan mati yang tercatat hari ini",
      label: "Mortalitas Hari Ini",
      value: formatNumber(data.mortalityTodayCount),
      valueClassName: data.mortalityTodayCount > 0 ? "text-destructive" : undefined,
    },
    {
      helper: "Siklus yang jadwal panennya paling dekat",
      label: "Panen Terdekat",
      value:
        data.nearestHarvestDaysLeft != null
          ? `${formatNumber(data.nearestHarvestDaysLeft)} hari lagi`
          : "-",
      valueSubtext: data.nearestHarvestLabel !== "-" ? data.nearestHarvestLabel : undefined,
    },
  ]

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Ringkasan operasional farm
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl text-sm">
            Gambaran cepat kondisi {data.farmLabel.toLowerCase()} hari ini untuk membantu
            menentukan prioritas kerja.
          </p>
        </div>

        <div className="border-border bg-card rounded-lg border px-4 py-3 shadow-sm">
          <p className="text-muted-foreground text-xs">Periode</p>
          <p className="mt-1 text-sm font-medium">Hari ini</p>
          <p className="text-muted-foreground mt-1 text-xs">
            {formatNumber(data.activeCyclesCount)} siklus aktif • {formatNumber(data.activePondsCount)} kolam aktif
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            className="border-border bg-card rounded-lg border p-4 shadow-sm"
            key={card.label}
          >
            <p className="text-muted-foreground text-sm">{card.label}</p>
            <p className={cn("mt-2 text-2xl font-semibold", card.valueClassName)}>
              {card.value}
            </p>
            {card.valueSubtext ? (
              <p className="text-muted-foreground mt-1 text-xs">{card.valueSubtext}</p>
            ) : null}
            <p className="text-muted-foreground mt-2 text-xs leading-5">
              {card.helper}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="border-border bg-card rounded-lg border p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Perlu Diperhatikan Hari Ini</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Daftar hal yang perlu segera ditindaklanjuti oleh tim operasional.
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
              <div className="border-border bg-background rounded-md border px-4 py-8 text-center">
                <p className="font-medium">Tidak ada catatan yang perlu ditindaklanjuti</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Input operasional hari ini sudah cukup lengkap pada seluruh siklus aktif.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-border bg-card rounded-lg border p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <Waves className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Siklus Aktif</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Snapshot singkat dari siklus yang sedang berjalan dan perlu dipantau.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {data.activeCycles.length ? (
              data.activeCycles.map((cycle) => (
                <article
                  className="border-border bg-background rounded-md border p-4"
                  key={cycle.id}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <h3 className="font-semibold">{cycle.name}</h3>
                      <p className="text-muted-foreground mt-1 text-sm">{cycle.pondsLabel}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <StatusPill label={`Umur ${formatNumber(cycle.ageDays)} hari`} />
                        <StatusPill
                          label={
                            cycle.targetHarvestDate
                              ? `Panen ${formatDate(cycle.targetHarvestDate)}`
                              : "Target panen belum diatur"
                          }
                        />
                      </div>
                    </div>

                    <Link
                      className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-2")}
                      href={cycle.href}
                    >
                      Detail
                    </Link>
                  </div>

                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <MetricItem
                      label="Estimasi Ikan Hidup"
                      value={`${formatNumber(cycle.aliveEstimate)} ekor`}
                    />
                    <MetricItem
                      label="Pakan Hari Ini"
                      value={`${formatNumber(cycle.feedTodayKg)} kg`}
                    />
                  </dl>
                </article>
              ))
            ) : (
              <div className="border-border bg-background rounded-md border px-4 py-8 text-center">
                <p className="font-medium">Belum ada siklus aktif</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Tambahkan siklus budidaya baru untuk mulai mencatat operasional.
                </p>
                <div className="mt-4">
                  <Link className={buttonVariants({ variant: "outline" })} href="/siklus-budidaya">
                    Buka Siklus Budidaya
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function MetricItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="border-border rounded-md border px-3 py-2.5">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  )
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="border-border bg-card inline-flex rounded-full border px-2 py-1 text-xs font-medium">
      {label}
    </span>
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
