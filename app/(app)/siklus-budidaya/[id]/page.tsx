import Link from "next/link"
import { ArrowLeft, CalendarDays, Info } from "lucide-react"
import { notFound } from "next/navigation"

import { requireSessionUser } from "@/app/lib/authz"
import { buttonVariants } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { getCycleById } from "../queries"
import {
  decimalToNumber,
  formatCurrency,
  formatDate,
  formatNumber,
  formatWeight,
  getCycleStatusLabel,
  getEstimatedAlive,
  getSurvivalRate,
} from "../utils"
import { CycleDetailTabs } from "./components/cycle-detail-tabs"
import { ExpenseLogSection } from "./components/expense-log-section"
import { FeedLogSection } from "./components/feed-log-section"
import { HarvestLogSection } from "./components/harvest-log-section"
import { MortalityLogSection } from "./components/mortality-log-section"
import { SamplingLogSection } from "./components/sampling-log-section"
import { TreatmentLogSection } from "./components/treatment-log-section"
import { WaterQualityLogSection } from "./components/water-quality-log-section"

type SummaryLine = {
  entryType?: "income" | "expense"
  label: string
  value: string
  valueClassName?: string
}

type SummaryItem = {
  label: string
  tooltipLines?: SummaryLine[]
  value: string
  valueClassName?: string
}

export default async function SiklusBudidayaDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params
  const query = await searchParams
  const user = await requireSessionUser()
  const cycle = await getCycleById(id)

  if (!cycle) {
    notFound()
  }

  const deadCount = cycle.mortalityLogs.reduce((sum, log) => sum + log.deadCount, 0)
  const feedUsed = cycle.feedLogs.reduce((sum, log) => sum + log.quantityKg, 0)
  const serializedExpenseLogs = cycle.expenseLogs.map((expenseLog) => ({
    ...expenseLog,
    amount: decimalToNumber(expenseLog.amount) ?? 0,
  }))
  const serializedFeedLogs = cycle.feedLogs.map((feedLog) => ({
    ...feedLog,
    priceTotal: decimalToNumber(feedLog.priceTotal),
  }))
  const serializedHarvestLogs = cycle.harvestLogs.map((harvestLog) => ({
    ...harvestLog,
    pricePerKg: decimalToNumber(harvestLog.pricePerKg) ?? 0,
  }))
  const totalExpense = serializedExpenseLogs.reduce(
    (sum, expenseLog) => sum + expenseLog.amount,
    0
  )
  const totalFeedCost = serializedFeedLogs.reduce(
    (sum, feedLog) => sum + (feedLog.priceTotal ?? 0),
    0
  )
  const totalSeedCost = decimalToNumber(cycle.seedPriceTotal) ?? 0
  const totalHarvestWeight = serializedHarvestLogs.reduce(
    (sum, harvestLog) => sum + harvestLog.totalWeightKg,
    0
  )
  const totalHarvestRevenue = serializedHarvestLogs.reduce(
    (sum, harvestLog) => sum + harvestLog.totalWeightKg * harvestLog.pricePerKg,
    0
  )
  const totalOperationalCost = totalSeedCost + totalFeedCost + totalExpense
  const operationalProfit = totalHarvestRevenue - totalOperationalCost
  const latestHarvest = serializedHarvestLogs[0]
  const latestSampling = cycle.samplingLogs[0]
  const latestTreatment = cycle.treatmentLogs[0]
  const latestWaterQuality = cycle.waterQualityLogs[0]
  const estimatedAlive = getEstimatedAlive(cycle.seedCount, deadCount)
  const activeTab = readDetailTab(query.tab)
  const summary: SummaryItem[] = [
    {
      label: "Estimasi Ikan Hidup",
      valueClassName: "text-primary",
      value: `${formatNumber(estimatedAlive)} ekor`,
    },
    {
      label: "Mortalitas",
      valueClassName: "text-destructive",
      value: `${formatNumber(deadCount)} ekor`,
    },
    {
      label: "Survival Rate",
      value: getSurvivalRate(cycle.seedCount, deadCount),
    },
    {
      label: "Untung / Rugi",
      value: formatCurrency(operationalProfit),
      valueClassName: getProfitValueClassName(operationalProfit),
      tooltipLines: [
        {
          label: "Pendapatan panen",
          entryType: "income",
          value: formatCurrency(totalHarvestRevenue),
        },
        {
          label: "Biaya bibit",
          entryType: "expense",
          value: formatCurrency(totalSeedCost),
        },
        {
          label: "Biaya pakan",
          entryType: "expense",
          value: formatCurrency(totalFeedCost),
        },
        {
          label: "Biaya manual",
          entryType: "expense",
          value: formatCurrency(totalExpense),
        },
        {
          label: "Untung / Rugi",
          value: formatCurrency(operationalProfit),
          valueClassName: getProfitValueClassName(operationalProfit),
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Link
          className={cn(buttonVariants({ variant: "ghost" }), "gap-2 px-0")}
          href="/siklus-budidaya"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Siklus Budidaya
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-muted-foreground text-sm">
              Siklus Budidaya / Detail
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">
                {cycle.cycleName}
              </h1>
              <span className="border-border bg-muted rounded-full border px-2 py-0.5 text-xs font-medium">
                {getCycleStatusLabel(cycle.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <SummaryCard
            key={item.label}
            label={item.label}
            tooltipLines={item.tooltipLines}
            value={item.value}
            valueClassName={item.valueClassName}
          />
        ))}
      </section>

      <section>
        <div className="border-border bg-card text-card-foreground rounded-lg border p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Informasi Siklus</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Data awal tebar dan target panen.
              </p>
            </div>
          </div>

          <dl className="mt-5 grid gap-4 text-sm md:grid-cols-3">
            <DetailMetric label="Tanggal Tebar" value={formatDate(cycle.startDate)} />
            <DetailMetric label="Target Panen" value={formatDate(cycle.targetHarvestDate)} />
            <DetailMetric label="Jumlah Bibit" value={`${formatNumber(cycle.seedCount)} ekor`} />
            <DetailMetric label="Berat Awal" value={formatWeight(cycle.initialAvgWeightG)} />
            <DetailMetric label="Harga Bibit" value={formatCurrency(cycle.seedPriceTotal)} />
            <DetailMetric
              label="Kolam"
              value={
                cycle.ponds.length
                  ? cycle.ponds.map((item) => item.pond.name).join(", ")
                  : "-"
              }
            />
          </dl>
        </div>
      </section>

      <section className="border-border bg-card rounded-lg border shadow-sm">
        <div className="border-border border-b p-3 sm:p-4">
          <CycleDetailTabs
            activeTab={activeTab}
            counts={{
              expenseLogs: cycle.expenseLogs.length,
              feedLogs: cycle.feedLogs.length,
              harvestLogs: cycle.harvestLogs.length,
              mortalityLogs: cycle.mortalityLogs.length,
              samplingLogs: cycle.samplingLogs.length,
              treatmentLogs: cycle.treatmentLogs.length,
              waterQualityLogs: cycle.waterQualityLogs.length,
            }}
            cycleId={cycle.id}
          />
        </div>

        <div className="p-4 sm:p-5">
          {activeTab === "ringkasan" ? (
            <section>
              <div className="border-border bg-card text-card-foreground rounded-lg border p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                    <CalendarDays className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Ringkasan Operasional</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Snapshot cepat dari data operasional yang sudah tercatat pada siklus ini.
                    </p>
                  </div>
                </div>

                <dl className="mt-5 grid gap-3 text-sm md:grid-cols-2">
                  <SummaryMetricRow label="Total Pakan" value={`${formatNumber(feedUsed)} kg`} />
                  <SummaryMetricRow label="Total Panen" value={`${formatNumber(totalHarvestWeight)} kg`} />
                  <SummaryMetricRow label="Mortalitas" value={`${formatNumber(deadCount)} ekor`} />
                  <SummaryMetricRow
                    label="Sampling Terakhir"
                    value={
                      latestSampling?.averageWeightG != null
                        ? `${formatNumber(latestSampling.averageWeightG)} g`
                        : "-"
                    }
                  />
                  <SummaryMetricRow
                    label="Pengobatan Terakhir"
                    value={latestTreatment ? formatDate(latestTreatment.logDate) : "-"}
                  />
                  <SummaryMetricRow
                    label="Panen Terakhir"
                    value={latestHarvest ? formatDate(latestHarvest.logDate) : "-"}
                  />
                  <SummaryMetricRow
                    label="pH Terakhir"
                    value={latestWaterQuality?.ph != null ? formatNumber(latestWaterQuality.ph) : "-"}
                  />
                </dl>
              </div>
            </section>
          ) : null}

          {activeTab === "biaya" ? (
            <ExpenseLogSection
              canManage={Boolean(user.id)}
              cycleId={cycle.id}
              expenseLogs={serializedExpenseLogs}
            />
          ) : null}

          {activeTab === "panen" ? (
            <HarvestLogSection
              canManage={Boolean(user.id)}
              cycleId={cycle.id}
              harvestLogs={serializedHarvestLogs}
            />
          ) : null}

          {activeTab === "pakan" ? (
            <FeedLogSection
              canManage={Boolean(user.id)}
              cycleId={cycle.id}
              feedLogs={serializedFeedLogs}
            />
          ) : null}

          {activeTab === "mortalitas" ? (
            <MortalityLogSection
              canManage={Boolean(user.id)}
              cycleId={cycle.id}
              mortalityLogs={cycle.mortalityLogs}
            />
          ) : null}

          {activeTab === "sampling" ? (
            <SamplingLogSection
              canManage={Boolean(user.id)}
              cycleId={cycle.id}
              samplingLogs={cycle.samplingLogs}
            />
          ) : null}

          {activeTab === "pengobatan" ? (
            <TreatmentLogSection
              canManage={Boolean(user.id)}
              cycleId={cycle.id}
              treatmentLogs={cycle.treatmentLogs}
            />
          ) : null}

          {activeTab === "kualitas-air" ? (
            <WaterQualityLogSection
              canManage={Boolean(user.id)}
              cycleId={cycle.id}
              waterQualityLogs={cycle.waterQualityLogs}
            />
          ) : null}
        </div>
      </section>
    </div>
  )
}

function readDetailTab(
  value: string | string[] | undefined
):
  | "ringkasan"
  | "biaya"
  | "panen"
  | "pakan"
  | "mortalitas"
  | "sampling"
  | "pengobatan"
  | "kualitas-air" {
  const tab = Array.isArray(value) ? value[0] : value

  if (
    tab === "biaya" ||
    tab === "panen" ||
    tab === "pakan" ||
    tab === "mortalitas" ||
    tab === "sampling" ||
    tab === "pengobatan" ||
    tab === "kualitas-air"
  ) {
    return tab
  }

  return "ringkasan"
}

function SummaryCard({
  label,
  tooltipLines,
  value,
  valueClassName,
}: {
  label: string
  tooltipLines?: Array<{
    entryType?: "income" | "expense"
    label: string
    value: string
    valueClassName?: string
  }>
  value: string
  valueClassName?: string
}) {
  return (
    <div className="border-border bg-card rounded-lg border p-4 shadow-sm">
      <div className="flex items-center gap-1.5">
        <p className="text-muted-foreground text-sm">{label}</p>
        {tooltipLines?.length ? (
          <Popover>
            <PopoverTrigger
              render={
                <button
                  aria-label={`Info perhitungan ${label}`}
                  className="text-muted-foreground hover:text-foreground inline-flex size-4 items-center justify-center rounded-sm transition-colors"
                  type="button"
                />
              }
            >
              <Info className="size-3.5" />
            </PopoverTrigger>
            <PopoverContent align="start" className="space-y-3">
              <PopoverHeader>
                <PopoverTitle>Detail Perhitungan</PopoverTitle>
                <PopoverDescription>
                  Perhitungan operasional pada card {label.toLowerCase()}.
                </PopoverDescription>
              </PopoverHeader>
              <div className="space-y-2">
                {tooltipLines.map((line) => (
                  <div
                    className="border-border bg-background flex items-start justify-between gap-4 rounded-md border px-3 py-2 text-sm"
                    key={line.label}
                  >
                    <div className="min-w-0 space-y-1">
                      <span className="text-muted-foreground block">{line.label}</span>
                      {line.entryType ? (
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                            line.entryType === "income"
                              ? "bg-primary/10 text-primary"
                              : "bg-destructive/10 text-destructive"
                          )}
                        >
                          {line.entryType === "income" ? "Pemasukan" : "Pengeluaran"}
                        </span>
                      ) : null}
                    </div>
                    <span className={cn("text-right font-medium", line.valueClassName)}>
                      {line.value}
                    </span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        ) : null}
      </div>
      <p className={cn("mt-2 text-2xl font-semibold", valueClassName)}>{value}</p>
    </div>
  )
}

function DetailMetric({
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

function SummaryMetricRow({
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

function getProfitValueClassName(value: number) {
  if (value > 0) {
    return "text-primary"
  }

  if (value < 0) {
    return "text-destructive"
  }

  return undefined
}
