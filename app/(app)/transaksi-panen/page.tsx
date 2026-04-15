import Link from "next/link"
import {
  CalendarClock,
  Plus,
  ReceiptText,
  Search,
} from "lucide-react"

import { createHarvestTransaction, updateHarvestTransaction } from "@/app/(app)/siklus-budidaya/[id]/actions"
import { HarvestTransactionDetailContent } from "@/app/(app)/siklus-budidaya/[id]/components/harvest-log-detail-content"
import { HarvestTransactionForm } from "@/app/(app)/siklus-budidaya/[id]/components/harvest-log-form"
import {
  formatCurrency,
  formatDate,
  formatNumber,
} from "@/app/(app)/siklus-budidaya/utils"
import { HarvestPaymentStatus } from "@/app/generated/prisma/enums"
import { CrudRowActions } from "@/components/crud-row-actions"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { deleteHarvestTransaction } from "./actions"
import {
  getHarvestTransactionPageData,
  type HarvestTransactionListItem,
} from "./queries"

export default async function TransaksiPanenPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const data = await getHarvestTransactionPageData(searchParams)

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Penjualan</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Penjualan Hasil Budidaya
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl text-sm">
            Pantau hasil panen yang langsung dijual per siklus, pembeli, dan status
            pembayarannya.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger render={<Button className="gap-2" type="button" />}>
              <Plus className="size-4" />
              Tambah Transaksi
            </DialogTrigger>
            <DialogContent
              className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto p-0 sm:max-w-3xl"
              showCloseButton={false}
            >
              <DialogHeader className="border-border border-b p-5">
                <p className="text-muted-foreground text-sm">Form Penjualan</p>
                <DialogTitle>Tambah Penjualan</DialogTitle>
                <DialogDescription>
                  Pilih siklus budidaya dan isi data panen yang langsung dijual.
                </DialogDescription>
              </DialogHeader>
              <HarvestTransactionForm
                action={createHarvestTransaction}
                closeTargetId="create-harvest-transaction-dialog-close"
                cycleOptions={data.cycleOptions}
                submitLabel="Simpan Penjualan"
              />
            </DialogContent>
          </Dialog>
          <Link
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
            href="/keuangan"
          >
            Lihat Keuangan
          </Link>
        </div>
      </section>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Filter Penjualan</CardTitle>
                <p className="text-muted-foreground mt-1 text-sm">
                  Cari transaksi berdasarkan invoice, pembeli, siklus, atau status
                  pembayaran.
                </p>
              </div>
              <span className="text-muted-foreground text-sm">
                {data.totalTransactions} transaksi ditemukan
              </span>
            </div>

            <form
              className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_14rem_14rem_auto_auto]"
              method="get"
            >
              <label className="relative block">
                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <input
                  className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border pr-3 pl-9 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                  defaultValue={data.filters.query}
                  name="query"
                  placeholder="Cari invoice, pembeli, atau siklus"
                />
              </label>

              <select
                className="border-input bg-white text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                defaultValue={data.filters.status}
                name="status"
              >
                <option value="all">Semua status</option>
                <option value="paid">Lunas</option>
                <option value="unpaid">Belum lunas</option>
                <option value="upcoming">Belum jatuh tempo</option>
                <option value="partial">DP</option>
              </select>

              <select
                className="border-input bg-white text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                defaultValue={data.filters.period}
                name="period"
              >
                <option value="30d">Periode: 30 hari</option>
                <option value="7d">Periode: 7 hari</option>
                <option value="90d">Periode: 90 hari</option>
                <option value="ytd">Tahun berjalan</option>
                <option value="all">Semua waktu</option>
              </select>

              <Button type="submit">Terapkan</Button>

              <Link
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "justify-center",
                )}
                href="/transaksi-panen"
              >
                Reset
              </Link>
            </form>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-0">
          <div className="border-border flex flex-col gap-2 border-b border-t p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Daftar Penjualan</CardTitle>
              <CardDescription className="mt-1">
                Semua panen yang langsung tercatat sebagai transaksi penjualan.
              </CardDescription>
            </div>
            <span className="text-muted-foreground text-sm">
              {data.totalTransactions} transaksi terbaru
            </span>
          </div>

          {data.transactions.length ? (
            <div className="divide-border divide-y">
              {data.transactions.map((transaction) => {
                const paymentStatus = getPaymentStatusMeta(transaction)

                return (
                  <article
                    className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
                    key={transaction.id}
                  >
                    <div className="min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                          <ReceiptText className="size-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{transaction.invoiceNumber}</h3>
                          <p className="text-muted-foreground text-sm">
                            {transaction.buyerName}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                            paymentStatus.className,
                          )}
                        >
                          {paymentStatus.label}
                        </span>
                      </div>

                      <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        <span className="flex items-center gap-2">
                          <CalendarClock className="size-4 shrink-0" />
                          {formatDate(transaction.harvestDate)}
                        </span>
                        <span>{transaction.cultureCycle.cycleName}</span>
                      </div>

                      <p className="text-muted-foreground text-sm">
                        {transaction.notes || "Tidak ada catatan tambahan."}
                      </p>
                    </div>

                    <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4 lg:grid-cols-1">
                      <TransactionMetric
                        label="Volume"
                        value={`${formatNumber(transaction.totalWeightKg)} kg`}
                      />
                      <TransactionMetric
                        label="Harga / kg"
                        value={formatCurrency(transaction.pricePerKg)}
                      />
                      <TransactionMetric
                        label="Total"
                        value={formatCurrency(transaction.grossAmount)}
                      />
                      <TransactionMetric
                        label="Status"
                        value={paymentStatus.label}
                      />
                    </dl>

                    <CrudRowActions
                      deleteAction={deleteHarvestTransaction}
                      deleteDescription="Transaksi panen yang dihapus tidak bisa dikembalikan untuk"
                      detailContent={
                        <HarvestTransactionDetailContent transaction={transaction} />
                      }
                      detailDescription={transaction.cultureCycle.cycleName}
                      detailTitle={transaction.invoiceNumber}
                      editContent={
                        <HarvestTransactionForm
                          action={updateHarvestTransaction}
                          closeTargetId={`edit-harvest-transaction-dialog-close-${transaction.id}`}
                          cycleId={transaction.cultureCycle.id}
                          submitLabel="Simpan Perubahan"
                          transaction={transaction}
                        />
                      }
                      editDescription="Perbarui transaksi panen yang tersimpan di database."
                      editTitle="Edit Penjualan"
                      itemId={transaction.id}
                      itemName={transaction.invoiceNumber}
                    />
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <h2 className="font-semibold">Belum ada transaksi panen</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Catat panen dari detail siklus budidaya untuk mulai melihat transaksi
                di halaman ini.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function getPaymentStatusMeta(transaction: HarvestTransactionListItem) {
  if (transaction.paymentStatus === HarvestPaymentStatus.PAID) {
    return {
      className: "bg-primary/12 text-primary",
      label: "Lunas",
    }
  }

  if (transaction.paymentStatus === HarvestPaymentStatus.PARTIALLY_PAID) {
    return {
      className: "bg-[#E5A93D]/15 text-[#A87412]",
      label: "DP",
    }
  }

  if (transaction.dueDate && transaction.dueDate >= startOfDay(new Date())) {
    return {
      className: "bg-[#125E8A]/12 text-[#125E8A]",
      label: "Belum jatuh tempo",
    }
  }

  return {
    className: "bg-destructive/10 text-destructive",
    label: "Belum lunas",
  }
}

function startOfDay(value: Date) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

function TransactionMetric({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  )
}
