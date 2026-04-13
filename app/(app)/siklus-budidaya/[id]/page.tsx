import Link from "next/link"
import { ArrowLeft, CalendarDays, FileText, Waves } from "lucide-react"
import { notFound } from "next/navigation"

import { requireSessionUser } from "@/app/lib/authz"
import { buttonVariants } from "@/components/ui/button"
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
import { MortalityLogSection } from "./components/mortality-log-section"
import { SamplingLogSection } from "./components/sampling-log-section"
import { TreatmentLogSection } from "./components/treatment-log-section"
import { WaterQualityLogSection } from "./components/water-quality-log-section"

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
  const totalExpense = serializedExpenseLogs.reduce(
    (sum, expenseLog) => sum + expenseLog.amount,
    0
  )
  const latestExpense = serializedExpenseLogs[0]
  const latestSampling = cycle.samplingLogs[0]
  const latestTreatment = cycle.treatmentLogs[0]
  const latestWaterQuality = cycle.waterQualityLogs[0]
  const estimatedAlive = getEstimatedAlive(cycle.seedCount, deadCount)
  const activeTab = readDetailTab(query.tab)
  const summary = [
    { label: "Estimasi Ikan Hidup", value: `${formatNumber(estimatedAlive)} ekor` },
    { label: "Jumlah Kolam", value: `${formatNumber(cycle.ponds.length)} kolam` },
    { label: "Total Pakan", value: `${formatNumber(feedUsed)} kg` },
    { label: "Mortalitas", value: `${formatNumber(deadCount)} ekor` },
    { label: "Survival Rate", value: getSurvivalRate(cycle.seedCount, deadCount) },
  ]

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
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
              Detail dasar siklus budidaya dari database. Form operasional siklus
              akan dikerjakan berikutnya.
            </p>
          </div>

          <div className="border-border bg-card rounded-lg border px-4 py-3 shadow-sm">
            <p className="text-muted-foreground text-xs">Farm</p>
            <p className="mt-1 text-sm font-medium">
              {cycle.farm?.name ?? "Tanpa farm"}
            </p>
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-5">
        {summary.map((item) => (
          <SummaryCard key={item.label} label={item.label} value={item.value} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.6fr)]">
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
              label="Survival Rate"
              value={getSurvivalRate(cycle.seedCount, deadCount)}
            />
          </dl>
        </div>

        <div className="border-border bg-card text-card-foreground rounded-lg border p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <Waves className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Kolam Dalam Siklus</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Selama siklus aktif, kolam-kolam ini tidak bisa dipakai untuk siklus aktif lain.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {cycle.ponds.map((item) => (
              <div className="border-border bg-background rounded-lg border p-3" key={item.pond.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{item.pond.name}</p>
                  <span className="text-muted-foreground text-xs">
                    {item.pond.status}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {item.pond.type} / {item.pond.shape}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border bg-card rounded-lg border shadow-sm">
        <div className="border-border border-b p-3 sm:p-4">
          <CycleDetailTabs
            activeTab={activeTab}
            counts={{
              expenseLogs: cycle.expenseLogs.length,
              feedLogs: cycle.feedLogs.length,
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
            <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
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

                <dl className="mt-5 grid gap-4 text-sm md:grid-cols-2">
                  <DetailMetric label="Total Pakan" value={`${formatNumber(feedUsed)} kg`} />
                  <DetailMetric label="Biaya Manual" value={formatCurrency(totalExpense)} />
                  <DetailMetric label="Mortalitas" value={`${formatNumber(deadCount)} ekor`} />
                  <DetailMetric label="Jumlah Catatan Pakan" value={formatNumber(cycle.feedLogs.length)} />
                  <DetailMetric
                    label="Jumlah Catatan Biaya"
                    value={formatNumber(cycle.expenseLogs.length)}
                  />
                  <DetailMetric
                    label="Jumlah Catatan Mortalitas"
                    value={formatNumber(cycle.mortalityLogs.length)}
                  />
                  <DetailMetric
                    label="Sampling Terakhir"
                    value={
                      latestSampling?.averageWeightG != null
                        ? `${formatNumber(latestSampling.averageWeightG)} g`
                        : "-"
                    }
                  />
                  <DetailMetric
                    label="Jumlah Catatan Sampling"
                    value={formatNumber(cycle.samplingLogs.length)}
                  />
                  <DetailMetric
                    label="Pengobatan Terakhir"
                    value={latestTreatment ? formatDate(latestTreatment.logDate) : "-"}
                  />
                  <DetailMetric
                    label="Biaya Terakhir"
                    value={latestExpense ? formatDate(latestExpense.logDate) : "-"}
                  />
                  <DetailMetric
                    label="Jumlah Catatan Pengobatan"
                    value={formatNumber(cycle.treatmentLogs.length)}
                  />
                  <DetailMetric
                    label="pH Terakhir"
                    value={latestWaterQuality?.ph != null ? formatNumber(latestWaterQuality.ph) : "-"}
                  />
                  <DetailMetric
                    label="Jumlah Catatan Kualitas Air"
                    value={formatNumber(cycle.waterQualityLogs.length)}
                  />
                </dl>
              </div>

              <div className="border-border bg-card text-card-foreground rounded-lg border p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Status Pengembangan</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                      CRUD siklus, pakan, mortalitas, sampling, pengobatan, kualitas air,
                      dan biaya manual sudah aktif. Modul panen akan dikerjakan pada tahap
                      berikutnya.
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground mt-5 text-sm">
                  Saat ini input pakan, mortalitas, sampling, pengobatan, kualitas air,
                  dan biaya manual sudah terhubung ke database. Nominal dari modul biaya
                  belum digabung otomatis dengan harga bibit, pakan, atau pengobatan
                  dari modul lain agar tidak terjadi hitung ganda.
                </p>
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
  | "pakan"
  | "mortalitas"
  | "sampling"
  | "pengobatan"
  | "kualitas-air" {
  const tab = Array.isArray(value) ? value[0] : value

  if (
    tab === "biaya" ||
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

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border bg-card rounded-lg border p-4 shadow-sm">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  )
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  )
}
