import Link from "next/link"
import {
  ChartColumn,
  Info,
  Landmark,
  ReceiptText,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { FinanceReportActions } from "./components/finance-report-actions"
import { MonthField } from "./components/month-field"
import { FinanceTrendChart } from "./components/finance-trend-chart"
import { getFinancePageData } from "./queries"

export default async function KeuanganPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const data = await getFinancePageData(searchParams)

  const summaryCards: Array<{
    accentClassName: string
    helper: string
    icon: LucideIcon
    iconClassName: string
    label: string
    value: string
    valueClassName?: string
  }> = [
    {
      accentClassName: "",
      helper: "Total pemasukan panen farm pada periode terpilih",
      icon: Wallet,
      iconClassName: "bg-primary/12 text-primary",
      label: "Pendapatan Periode",
      value: formatCurrency(data.revenue),
      valueClassName: "text-primary",
    },
    {
      accentClassName: "",
      helper: "Bibit, pakan, dan biaya manual pada rentang bulan terpilih",
      icon: ReceiptText,
      iconClassName: "bg-[#125E8A]/12 text-[#125E8A]",
      label: "Biaya Operasional",
      value: formatCurrency(data.operationalCost),
      valueClassName: "text-[#125E8A]",
    },
    {
      accentClassName: "",
      helper: "Akumulasi penyusutan kolam dan alat pada rentang bulan terpilih",
      icon: Landmark,
      iconClassName: "bg-[#E5A93D]/15 text-[#A87412]",
      label: "Penyusutan",
      value: formatCurrency(data.totalDepreciation),
      valueClassName: "text-[#8A6718]",
    },
    {
      accentClassName: "",
      helper: "Pendapatan dikurangi biaya operasional dan penyusutan.",
      icon: TrendingUp,
      iconClassName:
        data.netProfit >= 0
          ? "bg-primary/12 text-primary"
          : "bg-destructive/12 text-destructive",
      label: "Laba Bersih",
      value: formatCurrency(data.netProfit),
      valueClassName: getProfitValueClassName(data.netProfit),
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
      <section>
        <p className="text-muted-foreground text-sm">Keuangan</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Laporan Keuangan
        </h1>
        <p className="text-muted-foreground mt-2 max-w-3xl text-sm">
          Pantau kinerja keuangan budidaya berdasarkan periode laporan.
        </p>
      </section>

      <Card>
        <CardContent className="pt-5">
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Pilih Periode Laporan
              </p>
            </div>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <form
                className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
                method="get"
              >
                <MonthField
                  defaultValue={data.startMonthParam}
                  label="Bulan Awal"
                  layout="stacked"
                  name="start"
                />
                <MonthField
                  defaultValue={data.endMonthParam}
                  label="Bulan Akhir"
                  layout="stacked"
                  name="end"
                />
                <Button className="h-10" type="submit">
                  Terapkan
                </Button>
              </form>

              <div className="flex flex-wrap gap-2">
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-10 gap-2 justify-center",
                  )}
                  href={`?start=${data.previousStartMonthParam}&end=${data.previousEndMonthParam}`}
                >
                  Sebelumnya
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-10 gap-2 justify-center",
                  )}
                  href={`?start=${data.nextStartMonthParam}&end=${data.nextEndMonthParam}`}
                >
                  Berikutnya
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg",
                      card.iconClassName,
                    )}
                  >
                    <card.icon className="size-5" />
                  </div>
                  <p className="text-muted-foreground pt-1 text-sm">{card.label}</p>
                </div>

                <Popover>
                  <PopoverTrigger
                    render={
                      <button
                        aria-label={`Helper ${card.label}`}
                        className="text-muted-foreground hover:text-foreground inline-flex size-5 shrink-0 items-center justify-center rounded-sm transition-colors"
                        type="button"
                      />
                    }
                  >
                    <Info className="size-4" />
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="space-y-2"
                    side="bottom"
                  >
                    <PopoverHeader>
                      <PopoverDescription>{card.helper}</PopoverDescription>
                    </PopoverHeader>
                  </PopoverContent>
                </Popover>
              </div>
              <p
                className={cn(
                  "mt-4 text-2xl font-semibold",
                  card.valueClassName,
                )}
              >
                {card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <ChartColumn className="size-5" />
            </div>
            <div>
              <CardTitle>Tren Pendapatan, Biaya, dan Laba</CardTitle>
              <CardDescription className="mt-1">
                Cukup satu grafik untuk membaca arah usaha farm pada rentang{" "}
                {data.periodLabel.toLowerCase()}.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FinanceTrendChart points={data.trendPoints} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <Wallet className="size-5" />
            </div>
            <div>
              <CardTitle>Laporan Laba Rugi</CardTitle>
              <CardDescription className="mt-1">
                Tabel utama laporan dan aksi cetak disatukan dalam satu bagian
                agar alurnya lebih ringkas.
              </CardDescription>
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
        </CardHeader>
        <CardContent>
          <div className="border-border bg-background overflow-x-auto rounded-md border">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <Info className="size-5" />
            </div>
            <div>
              <CardTitle>Detail Perhitungan</CardTitle>
              <CardDescription className="mt-1">
                Detail biaya dan cara hitung disimpan di bagian ini agar halaman
                utama tetap singkat.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
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
