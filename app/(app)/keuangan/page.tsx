import Link from "next/link"
import {
  ChartColumn,
  Info,
  Wallet,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

import { FinanceReportActions } from "./components/finance-report-actions"
import { FinanceTrendChart } from "./components/finance-trend-chart"
import { getFinancePageData } from "./queries"

export default async function KeuanganPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const data = await getFinancePageData(searchParams)

  const summaryCards: Array<{
    helper: string
    label: string
    value: string
    valueClassName?: string
  }> = [
    {
      helper: "Total pemasukan panen farm pada periode terpilih",
      label: "Pendapatan Periode",
      value: formatCurrency(data.revenue),
      valueClassName: "text-primary",
    },
    {
      helper: "Bibit, pakan, dan biaya manual pada rentang bulan terpilih",
      label: "Biaya Operasional",
      value: formatCurrency(data.operationalCost),
    },
    {
      helper: "Pendapatan dikurangi biaya operasional langsung",
      label: "Laba Operasional",
      value: formatCurrency(data.operationalProfit),
      valueClassName: getProfitValueClassName(data.operationalProfit),
    },
    {
      helper: "Akumulasi penyusutan kolam dan alat pada rentang bulan terpilih",
      label: "Penyusutan",
      value: formatCurrency(data.totalDepreciation),
    },
  ]

  const expenseBreakdown = [
    {
      label: "Bibit",
      note: "Diakui saat siklus mulai pada bulan yang masuk ke rentang terpilih.",
      value: formatCurrency(data.seedCost),
    },
    {
      label: "Pakan",
      note: "Akumulasi harga pakan dari catatan pakan pada rentang bulan terpilih.",
      value: formatCurrency(data.feedCost),
    },
    {
      label: "Biaya Manual",
      note: "Pengeluaran manual seperti listrik, tenaga kerja, dan biaya lain.",
      value: formatCurrency(data.expenseCost),
    },
    {
      label: "Penyusutan Kolam",
      note: `${formatNumber(data.pondDepreciationAssetCount)} aset kolam tersusut pada rentang ini.`,
      value: formatCurrency(data.pondDepreciation),
    },
    {
      label: "Penyusutan Alat",
      note: `${formatNumber(data.equipmentDepreciationAssetCount)} alat tersusut pada rentang ini.`,
      value: formatCurrency(data.equipmentDepreciation),
    },
  ]

  return (
    <div className="space-y-6">
      <section className="border-border bg-card rounded-lg border p-5 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Keuangan</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Ringkasan keuangan farm
            </h1>
            <p className="text-muted-foreground mt-2 max-w-3xl text-sm">
              Halaman ini diringkas untuk membantu membaca hasil usaha lebih
              cepat: lihat hasil, baca tren, lalu buka detail biaya jika
              diperlukan.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <form
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
              method="get"
            >
              <MonthField
                defaultValue={data.startMonthParam}
                label="Bulan Awal"
                name="start"
              />
              <MonthField
                defaultValue={data.endMonthParam}
                label="Bulan Akhir"
                name="end"
              />
              <Button type="submit">Terapkan</Button>
            </form>

            <div className="flex flex-wrap gap-2">
              <Link
                className={buttonVariants({ size: "sm", variant: "outline" })}
                href={`?start=${data.previousStartMonthParam}&end=${data.previousEndMonthParam}`}
              >
                Periode Sebelumnya
              </Link>
              <Link
                className={buttonVariants({ size: "sm", variant: "outline" })}
                href={`?start=${data.nextStartMonthParam}&end=${data.nextEndMonthParam}`}
              >
                Periode Berikutnya
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            className="border-border bg-card rounded-lg border p-4 shadow-sm"
            key={card.label}
          >
            <p className="text-muted-foreground text-sm">{card.label}</p>
            <p
              className={cn("mt-2 text-2xl font-semibold", card.valueClassName)}
            >
              {card.value}
            </p>
            <p className="text-muted-foreground mt-2 text-xs leading-5">
              {card.helper}
            </p>
          </div>
        ))}
      </section>

      <section className="border-border bg-card rounded-lg border p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <ChartColumn className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">
                Tren Pendapatan, Biaya, dan Laba
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Cukup satu grafik untuk membaca arah usaha farm pada rentang{" "}
                {data.periodLabel.toLowerCase()}.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <FinanceTrendChart points={data.trendPoints} />
          </div>
      </section>

      <section className="border-border bg-card rounded-lg border p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <Wallet className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Laporan Laba Rugi</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Tabel utama laporan dan aksi cetak disatukan dalam satu bagian
                agar alurnya lebih ringkas.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <FinanceReportActions
              farmLabel={data.farmLabel}
              periodLabel={data.periodLabel}
              rows={data.reportRows}
              summary={{
                depreciation: data.totalDepreciation,
                netProfit: data.netProfit,
                operationalCost: data.operationalCost,
                revenue: data.revenue,
              }}
            />
          </div>
        </div>

        <div className="border-border bg-background mt-5 overflow-x-auto rounded-md border">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(8rem,1fr))] gap-3 border-b px-3 py-2 text-xs font-medium text-muted-foreground">
              <span>Periode</span>
              <span className="text-right">Pendapatan</span>
              <span className="text-right">Biaya</span>
              <span className="text-right">Penyusutan</span>
              <span className="text-right">Laba Bersih</span>
            </div>
            <div className="divide-border divide-y">
              {data.reportRows.map((row) => (
                <div
                  className="grid grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(8rem,1fr))] gap-3 px-3 py-2 text-sm"
                  key={row.label}
                >
                  <span>{row.label}</span>
                  <span className="text-right">
                    {formatCurrency(row.revenue)}
                  </span>
                  <span className="text-right">
                    {formatCurrency(row.operationalCost)}
                  </span>
                  <span className="text-right">
                    {formatCurrency(row.depreciation)}
                  </span>
                  <span
                    className={cn(
                      "text-right font-medium",
                      getProfitValueClassName(row.netProfit),
                    )}
                  >
                    {formatCurrency(row.netProfit)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-border bg-card rounded-lg border p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
            <Info className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold">Detail Perhitungan</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Detail biaya dan cara hitung disimpan di bagian ini agar halaman
              utama tetap singkat.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <Accordion defaultValue={[]} multiple>
            <AccordionItem value="rincian-biaya">
              <AccordionHeader>
                <AccordionTrigger className="bg-background rounded-md">
                  <div className="min-w-0">
                    <p>Rincian Biaya</p>
                    <p className="text-muted-foreground mt-1 text-xs font-normal">
                      Bibit, pakan, biaya manual, dan penyusutan.
                    </p>
                  </div>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent className="border-border border-t px-3 py-3">
                <div className="space-y-3">
                  {expenseBreakdown.map((item) => (
                    <div
                      className="border-border bg-background rounded-md border px-3 py-3"
                      key={item.label}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-muted-foreground mt-1 text-xs leading-5">
                            {item.note}
                          </p>
                        </div>
                        <p className="text-right font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="mt-3" value="dasar-perhitungan">
              <AccordionHeader>
                <AccordionTrigger className="bg-background rounded-md">
                  <div className="min-w-0">
                    <p>Dasar Perhitungan</p>
                    <p className="text-muted-foreground mt-1 text-xs font-normal">
                      Penjelasan singkat agar angka mudah dipahami pengguna.
                    </p>
                  </div>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent className="border-border border-t px-3 py-3">
                <div className="space-y-3">
                  <InfoCard
                    title="Bibit"
                    description="Biaya bibit dihitung dari siklus yang tanggal tebar-nya masuk ke rentang bulan terpilih."
                  />
                  <InfoCard
                    title="Pakan"
                    description="Biaya pakan diambil dari catatan pakan pada rentang bulan terpilih yang memiliki harga."
                  />
                  <InfoCard
                    title="Biaya Manual"
                    description="Biaya manual diambil dari modul biaya pada rentang bulan terpilih."
                  />
                  <InfoCard
                    title="Penyusutan"
                    description="Penyusutan dihitung lurus per bulan dari harga beli dibagi umur penyusutan. Jika tanggal mulai tidak diisi, sistem memakai tanggal data dibuat sebagai fallback."
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}

function MonthField({
  defaultValue,
  label,
  name,
}: {
  defaultValue: string
  label: string
  name: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <input
        className="border-input bg-background h-10 rounded-md border px-3 text-sm outline-none"
        defaultValue={defaultValue}
        id={name}
        name={name}
        type="month"
      />
    </div>
  )
}

function InfoCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="border-border bg-background rounded-md border px-3 py-3">
      <p className="font-medium">{title}</p>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    </div>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value)
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
