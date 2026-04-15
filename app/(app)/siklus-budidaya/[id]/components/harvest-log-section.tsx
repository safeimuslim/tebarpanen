"use client"

import { PackageCheck, Plus } from "lucide-react"

import { CrudRowActions } from "@/components/crud-row-actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SummaryCard } from "@/components/ui/summary-card"

import { formatCurrency, formatDate, formatNumber } from "../../utils"
import {
  createHarvestTransaction,
  deleteHarvestTransaction,
  updateHarvestTransaction,
} from "../actions"
import type { HarvestTransactionItem } from "../types"
import { HarvestTransactionDetailContent } from "./harvest-log-detail-content"
import { HarvestTransactionForm } from "./harvest-log-form"

export function HarvestTransactionSection({
  canManage,
  cycleId,
  harvestTransactions,
}: {
  canManage: boolean
  cycleId: string
  harvestTransactions: HarvestTransactionItem[]
}) {
  const totalWeight = harvestTransactions.reduce((sum, item) => sum + item.totalWeightKg, 0)
  const totalRevenue = harvestTransactions.reduce((sum, item) => sum + item.grossAmount, 0)

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Panen</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Catat panen parsial atau final yang langsung menjadi transaksi penjualan.
          </p>
        </div>

        {canManage ? (
          <Dialog>
            <DialogTrigger
              render={<Button className="gap-2" type="button" variant="default" />}
            >
              <Plus className="size-4" />
              Tambah Panen
            </DialogTrigger>
            <DialogContent
              className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto p-0 sm:max-w-2xl"
              showCloseButton={false}
            >
              <DialogHeader className="border-border border-b p-5">
                <p className="text-muted-foreground text-sm">Form Operasional Siklus</p>
                <DialogTitle>Tambah Transaksi Panen</DialogTitle>
                <DialogDescription>
                  Data panen akan tersimpan sekaligus sebagai transaksi penjualan siklus ini.
                </DialogDescription>
              </DialogHeader>
              <HarvestTransactionForm
                action={createHarvestTransaction}
                closeTargetId="create-harvest-log-dialog-close"
                cycleId={cycleId}
                submitLabel="Simpan Transaksi Panen"
              />
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard
          label="Jumlah Transaksi"
          value={formatNumber(harvestTransactions.length)}
        />
        <SummaryCard label="Total Berat Panen" value={`${formatNumber(totalWeight)} kg`} />
        <SummaryCard label="Total Penjualan" value={formatCurrency(totalRevenue)} />
        <SummaryCard
          label="Panen Terakhir"
          value={
            harvestTransactions[0]
              ? formatDate(harvestTransactions[0].harvestDate)
              : "-"
          }
        />
      </div>

      <div className="border-border bg-card overflow-hidden rounded-lg border">
        <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">List Panen</h3>
            <p className="text-muted-foreground text-sm">
              Riwayat panen yang langsung tercatat sebagai transaksi penjualan.
            </p>
          </div>
          <span className="text-muted-foreground text-sm">
            {formatNumber(harvestTransactions.length)} transaksi
          </span>
        </div>

        {harvestTransactions.length ? (
          <div className="divide-border divide-y">
            {harvestTransactions.map((transaction) => {
              return (
                <article
                  className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
                  key={transaction.id}
                >
                  <div className="min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-muted flex size-8 items-center justify-center rounded-md">
                        <PackageCheck className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate font-semibold">
                          {transaction.buyerName}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {transaction.invoiceNumber}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {formatNumber(transaction.harvestedCount)} ekor /
                      {" "}
                      {formatNumber(transaction.totalWeightKg)} kg
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {formatDate(transaction.harvestDate)}
                    </p>
                    {transaction.notes ? (
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {transaction.notes}
                      </p>
                    ) : null}
                  </div>

                  <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3 lg:grid-cols-1">
                    <Metric label="Harga / kg" value={formatCurrency(transaction.pricePerKg)} />
                    <Metric label="Nilai Transaksi" value={formatCurrency(transaction.grossAmount)} />
                    <Metric label="Dicatat" value={formatDate(transaction.createdAt)} />
                  </dl>

                  {canManage ? (
                    <CrudRowActions
                      deleteAction={deleteHarvestTransaction}
                      deleteDescription="Transaksi panen yang dihapus tidak bisa dikembalikan untuk"
                      deleteHiddenFields={[{ name: "cycleId", value: cycleId }]}
                      detailContent={
                        <HarvestTransactionDetailContent transaction={transaction} />
                      }
                      detailDescription={formatDate(transaction.harvestDate)}
                      detailTitle={transaction.buyerName}
                      editContent={
                        <HarvestTransactionForm
                          action={updateHarvestTransaction}
                          closeTargetId={`edit-harvest-log-dialog-close-${transaction.id}`}
                          cycleId={cycleId}
                          transaction={transaction}
                          submitLabel="Simpan Perubahan"
                        />
                      }
                      editDescription="Perbarui transaksi panen untuk siklus budidaya ini."
                      editTitle="Edit Transaksi Panen"
                      itemId={transaction.id}
                      itemName={transaction.invoiceNumber}
                    />
                  ) : (
                    <div className="flex items-start justify-end">
                      <Dialog>
                        <DialogTrigger
                          render={<Button className="gap-2" size="sm" type="button" variant="outline" />}
                        >
                          Detail
                        </DialogTrigger>
                        <DialogContent
                          className="w-full max-w-[calc(100%-2rem)] p-0 sm:max-w-2xl"
                          showCloseButton={false}
                        >
                          <DialogHeader className="border-border border-b p-5">
                            <p className="text-muted-foreground text-sm">Detail Panen</p>
                            <DialogTitle>{transaction.buyerName}</DialogTitle>
                            <DialogDescription>{transaction.invoiceNumber}</DialogDescription>
                          </DialogHeader>
                          <HarvestTransactionDetailContent transaction={transaction} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="font-semibold">Belum ada transaksi panen</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Tambahkan transaksi panen pertama untuk siklus ini.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  )
}
