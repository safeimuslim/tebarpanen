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
    accentClassName: string
    description: string
    icon: LucideIcon
    label: string
    value: string
    valueClassName?: string
  }> = [
    {
      accentClassName: "bg-[#125E8A]/12 text-[#125E8A]",
      description: "Semua kolam yang sedang berjalan saat ini.",
      icon: Waves,
      label: "Kolam aktif",
      value: formatNumber(data.activePondsCount),
    },
    {
      accentClassName: "bg-primary/12 text-primary",
      description: "Siklus yang masih perlu dipantau setiap hari.",
      icon: Package,
      label: "Siklus aktif",
      value: formatNumber(data.activeCyclesCount),
    },
    {
      accentClassName: "bg-[#E5A93D]/15 text-[#A87412]",
      description: "Perkiraan ikan hidup dari seluruh siklus aktif.",
      icon: Fish,
      label: "Estimasi ikan hidup",
      value: formatNumber(data.totalEstimatedAlive),
    },
    {
      accentClassName:
        data.nearestHarvestDaysLeft != null && data.nearestHarvestDaysLeft <= 7
          ? "bg-primary/12 text-primary"
          : "bg-[#EEF5F4] text-[#5B7483]",
      description:
        data.nearestHarvestDaysLeft != null
          ? `Target panen terdekat pada ${data.nearestHarvestLabel}.`
          : "Belum ada target panen yang diatur.",
      icon: CalendarDays,
      label: "Panen terdekat",
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

  const quickActions = [
    { href: "/siklus-budidaya", label: "Lihat Siklus" },
    { href: "/transaksi-panen", label: "Catat Penjualan" },
    { href: "/keuangan", label: "Lihat Keuangan" },
  ]

  const visibleCycles = data.activeCycles.slice(0, 4)

  return (
    <div className="-m-4 space-y-6 bg-[linear-gradient(180deg,#f7fbfa_0%,#edf6f4_100%)] p-4 sm:-m-6 sm:p-6">
      <section className="overflow-hidden rounded-[2rem] border border-[#d9e9e4] bg-[linear-gradient(150deg,#163042_0%,#125e8a_58%,#0f9d8a_100%)] p-6 text-white shadow-[0_24px_60px_rgba(22,48,66,0.12)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/85">
              Dashboard operasional
            </div>
            <div className="space-y-2">
              <p className="text-sm text-white/74">Dashboard</p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Ringkasan budidaya hari ini untuk {data.farmLabel.toLowerCase()}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-white/82 sm:text-base">
                Pantau kolam aktif, panen yang makin dekat, dan hal yang perlu
                dicek hari ini dari satu layar yang lebih rapi.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <HighlightCard
              description="Pakan yang sudah masuk hari ini."
              label="Pakan hari ini"
              value={`${formatKg(data.feedTodayKg)} kg`}
            />
            <HighlightCard
              description="Mortalitas yang tercatat hari ini."
              label="Mortalitas hari ini"
              value={`${formatNumber(data.mortalityTodayCount)} ekor`}
            />
            <HighlightCard
              description="Akses cepat ke pekerjaan yang paling sering dibuka."
              label="Aksi cepat"
              value="3 menu"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              className={cn(
                buttonVariants({ size: "sm" }),
                "rounded-xl bg-white text-[#163042] hover:bg-white/92"
              )}
              href={action.href}
              key={action.href}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article
            className="rounded-[1.75rem] border border-[#d9e9e4] bg-white p-5 shadow-[0_14px_34px_rgba(22,48,66,0.04)]"
            key={card.label}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#456473]">{card.label}</p>
                <p
                  className={cn(
                    "mt-3 text-2xl font-semibold tracking-tight text-[#163042]",
                    card.valueClassName
                  )}
                >
                  {card.value}
                </p>
              </div>
              <div
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-2xl",
                  card.accentClassName
                )}
              >
                <card.icon className="size-5" />
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#5b7483]">
              {card.description}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(19rem,0.92fr)]">
        <div className="rounded-[1.75rem] border border-[#d9e9e4] bg-white p-5 shadow-[0_14px_34px_rgba(22,48,66,0.04)] sm:p-6">
          <div className="flex items-start gap-3">
            <div className="bg-[#FFF5E2] text-[#B07B18] flex size-11 items-center justify-center rounded-2xl">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold text-[#163042]">
                Yang perlu dicek hari ini
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#5b7483]">
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
                    className="flex items-start gap-3 rounded-2xl border border-[#d9e9e4] bg-[#fbfdfd] px-4 py-4"
                    key={`${alert.type}-${alert.cycleId ?? alert.label}`}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl",
                        alert.tone === "danger"
                          ? "bg-destructive/10 text-destructive"
                          : alert.tone === "warning"
                            ? "bg-[#FFF5E2] text-[#B07B18]"
                            : "bg-primary/12 text-primary"
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[#163042]">{alert.label}</p>
                      <p className="mt-1 text-sm leading-6 text-[#5b7483]">
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

        <div className="rounded-[1.75rem] border border-[#d9e9e4] bg-white p-5 shadow-[0_14px_34px_rgba(22,48,66,0.04)] sm:p-6">
          <div className="flex items-start gap-3">
            <div className="bg-primary/12 text-primary flex size-11 items-center justify-center rounded-2xl">
              <Fish className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold text-[#163042]">Panen terdekat</h2>
              <p className="mt-1 text-sm leading-6 text-[#5b7483]">
                Siklus yang jadwal panennya paling dekat dari hari ini.
              </p>
            </div>
          </div>

          <div className="mt-5">
            {data.nearestHarvest ? (
              <div className="rounded-[1.5rem] border border-[#d9e9e4] bg-[#f8fbfb] p-4">
                <p className="font-semibold text-[#163042]">
                  {data.nearestHarvest.cycleName}
                </p>
                <p className="mt-1 text-sm text-[#5b7483]">
                  {data.nearestHarvest.pondsLabel}
                </p>

                <dl className="mt-4 space-y-3 text-sm">
                  <MetricRow
                    label="Target panen"
                    value={formatDate(data.nearestHarvest.targetHarvestDate)}
                  />
                  <MetricRow
                    label="Sisa waktu"
                    value={`${formatNumber(data.nearestHarvest.daysLeft)} hari`}
                    valueClassName={
                      data.nearestHarvest.daysLeft <= 7 ? "text-primary" : undefined
                    }
                  />
                </dl>

                <div className="mt-4">
                  <Link
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" }),
                      "rounded-xl border-[#d9e9e4] bg-white"
                    )}
                    href={data.nearestHarvest.href}
                  >
                    Lihat detail siklus
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

      <section className="rounded-[1.75rem] border border-[#d9e9e4] bg-white p-5 shadow-[0_14px_34px_rgba(22,48,66,0.04)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-semibold text-[#163042]">Siklus yang sedang berjalan</h2>
            <p className="mt-1 text-sm leading-6 text-[#5b7483]">
              Daftar singkat siklus aktif yang paling sering perlu dipantau.
            </p>
          </div>

          {data.activeCycles.length ? (
            <Link
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "rounded-xl border-[#d9e9e4] bg-white"
              )}
              href="/siklus-budidaya"
            >
              Lihat semua siklus
            </Link>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3">
          {visibleCycles.length ? (
            visibleCycles.map((cycle) => (
              <article
                className="rounded-[1.5rem] border border-[#d9e9e4] bg-[#fbfdfd] p-4"
                key={cycle.id}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#163042]">{cycle.name}</h3>
                    <p className="mt-1 text-sm text-[#5b7483]">{cycle.pondsLabel}</p>
                  </div>

                  <Link
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" }),
                      "rounded-xl border-[#d9e9e4] bg-white"
                    )}
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
                    label="Estimasi hidup"
                    value={`${formatNumber(cycle.aliveEstimate)} ekor`}
                  />
                  <MetricRow
                    label="Target panen"
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
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-xl border-[#d9e9e4] bg-white"
                  )}
                  href="/siklus-budidaya"
                >
                  Buka siklus budidaya
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

function HighlightCard({
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
    <div className="rounded-[1.5rem] border border-[#d9e9e4] bg-[#fbfdfd] px-4 py-8 text-center">
      <p className="font-medium text-[#163042]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[#5b7483]">{description}</p>
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
    <div className="rounded-xl border border-[#d9e9e4] bg-white px-3 py-3">
      <dt className="text-xs text-[#6f8792]">{label}</dt>
      <dd className={cn("mt-1 font-medium text-[#163042]", valueClassName)}>
        {value}
      </dd>
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
    default:
      return CalendarDays
  }
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value)
}

function formatKg(value: number) {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: value % 1 === 0 ? 0 : 1,
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
  }).format(value)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value)
}
