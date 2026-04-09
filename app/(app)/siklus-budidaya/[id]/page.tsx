import Link from "next/link"
import { ArrowLeft, CalendarDays, FileText, Waves } from "lucide-react"
import { notFound } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { getCycleById } from "../queries"
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatWeight,
  getCycleStatusLabel,
  getEstimatedAlive,
  getSurvivalRate,
} from "../utils"

export default async function SiklusBudidayaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cycle = await getCycleById(id)

  if (!cycle) {
    notFound()
  }

  const deadCount = cycle.mortalityLogs.reduce((sum, log) => sum + log.deadCount, 0)
  const feedUsed = cycle.feedLogs.reduce((sum, log) => sum + log.quantityKg, 0)
  const estimatedAlive = getEstimatedAlive(cycle.seedCount, deadCount)
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

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
        <div className="border-border bg-card text-card-foreground rounded-lg border p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Ringkasan Operasional</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Ringkasan data yang sudah tercatat pada siklus ini.
              </p>
            </div>
          </div>

          <dl className="mt-5 grid gap-4 text-sm md:grid-cols-2">
            <DetailMetric label="Total Pakan" value={`${formatNumber(feedUsed)} kg`} />
            <DetailMetric label="Mortalitas" value={`${formatNumber(deadCount)} ekor`} />
            <DetailMetric label="Jumlah Catatan Pakan" value={formatNumber(cycle.feedLogs.length)} />
            <DetailMetric
              label="Jumlah Catatan Mortalitas"
              value={formatNumber(cycle.mortalityLogs.length)}
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
                CRUD siklus sudah aktif. Form operasional siklus akan dikerjakan
                pada tahap berikutnya.
              </p>
            </div>
          </div>

          <p className="text-muted-foreground mt-5 text-sm">
            Data operasional yang sudah ada akan tetap terbaca pada ringkasan ini,
            tetapi input form pakan, mortalitas, sampling, kualitas air, dan modul
            lain belum diintegrasikan pada halaman ini.
          </p>
        </div>
      </section>
    </div>
  )
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
