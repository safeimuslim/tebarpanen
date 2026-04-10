"use client"

import { Plus } from "lucide-react"

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

import { createFeedLog, deleteFeedLog, updateFeedLog } from "../actions"
import type { FeedLogItem } from "../types"
import { formatCurrency, formatDate, formatNumber } from "../../utils"
import { FeedLogDetailContent } from "./feed-log-detail-content"
import { FeedLogForm } from "./feed-log-form"

export function FeedLogSection({
  canManage,
  cycleId,
  feedLogs,
}: {
  canManage: boolean
  cycleId: string
  feedLogs: FeedLogItem[]
}) {
  const totalFeed = feedLogs.reduce((sum, item) => sum + item.quantityKg, 0)
  const totalFeedCost = feedLogs.reduce(
    (sum, item) => sum + (item.priceTotal ?? 0),
    0
  )

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Pakan</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Pencatatan pakan harian untuk siklus ini.
          </p>
        </div>

        {canManage ? (
          <Dialog>
            <DialogTrigger
              render={<Button className="gap-2" type="button" variant="default" />}
            >
              <Plus className="size-4" />
              Tambah Pakan
            </DialogTrigger>
            <DialogContent
              className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto p-0 sm:max-w-2xl"
              showCloseButton={false}
            >
              <DialogHeader className="border-border border-b p-5">
                <p className="text-muted-foreground text-sm">Form Operasional Siklus</p>
                <DialogTitle>Tambah Data Pakan</DialogTitle>
                <DialogDescription>
                  Catatan pakan akan tersimpan untuk siklus budidaya ini.
                </DialogDescription>
              </DialogHeader>
              <FeedLogForm
                action={createFeedLog}
                closeTargetId="create-feed-log-dialog-close"
                cycleId={cycleId}
                submitLabel="Simpan Data Pakan"
              />
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Jumlah Catatan" value={formatNumber(feedLogs.length)} />
        <SummaryCard label="Total Pakan" value={`${formatNumber(totalFeed)} kg`} />
        <SummaryCard label="Total Biaya Pakan" value={formatCurrency(totalFeedCost)} />
      </div>

      <div className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
        <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">List Pakan</h3>
            <p className="text-muted-foreground text-sm">
              Data pakan yang sudah tercatat pada siklus ini.
            </p>
          </div>
          <span className="text-muted-foreground text-sm">
            {formatNumber(feedLogs.length)} catatan
          </span>
        </div>

        {feedLogs.length ? (
          <div className="divide-border divide-y">
            {feedLogs.map((feedLog) => (
              <article
                className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
                key={feedLog.id}
              >
                <div className="min-w-0 space-y-2">
                  <h4 className="font-semibold">{feedLog.feedName}</h4>
                  <p className="text-muted-foreground text-sm">
                    {formatDate(feedLog.logDate)}
                  </p>
                  {feedLog.notes ? (
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {feedLog.notes}
                    </p>
                  ) : null}
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3 lg:grid-cols-1">
                  <Metric label="Berat" value={`${formatNumber(feedLog.quantityKg)} kg`} />
                  <Metric label="Harga" value={formatCurrency(feedLog.priceTotal)} />
                  <Metric label="Dicatat" value={formatDate(feedLog.createdAt)} />
                </dl>

                {canManage ? (
                  <CrudRowActions
                    deleteAction={deleteFeedLog}
                    deleteDescription="Data pakan yang dihapus tidak bisa dikembalikan untuk"
                    deleteHiddenFields={[{ name: "cycleId", value: cycleId }]}
                    detailContent={<FeedLogDetailContent feedLog={feedLog} />}
                    detailDescription={formatDate(feedLog.logDate)}
                    detailTitle={feedLog.feedName}
                    editContent={
                      <FeedLogForm
                        action={updateFeedLog}
                        closeTargetId={`edit-feed-log-dialog-close-${feedLog.id}`}
                        cycleId={cycleId}
                        feedLog={feedLog}
                        submitLabel="Simpan Perubahan"
                      />
                    }
                    editDescription="Perbarui data pakan untuk siklus budidaya ini."
                    editTitle="Edit Data Pakan"
                    itemId={feedLog.id}
                    itemName={feedLog.feedName}
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
                          <p className="text-muted-foreground text-sm">Detail Pakan</p>
                          <DialogTitle>{feedLog.feedName}</DialogTitle>
                          <DialogDescription>{formatDate(feedLog.logDate)}</DialogDescription>
                        </DialogHeader>
                        <FeedLogDetailContent feedLog={feedLog} />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="font-semibold">Belum ada catatan pakan</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Tambahkan pencatatan pakan pertama untuk siklus ini.
            </p>
          </div>
        )}
      </div>
    </section>
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  )
}
