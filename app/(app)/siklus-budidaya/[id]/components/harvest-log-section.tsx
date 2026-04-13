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

import { formatCurrency, formatDate, formatNumber } from "../../utils"
import {
  createHarvestLog,
  deleteHarvestLog,
  updateHarvestLog,
} from "../actions"
import type { HarvestLogItem } from "../types"
import { HarvestLogDetailContent } from "./harvest-log-detail-content"
import { HarvestLogForm } from "./harvest-log-form"

export function HarvestLogSection({
  canManage,
  cycleId,
  harvestLogs,
}: {
  canManage: boolean
  cycleId: string
  harvestLogs: HarvestLogItem[]
}) {
  const totalWeight = harvestLogs.reduce((sum, item) => sum + item.totalWeightKg, 0)
  const totalRevenue = harvestLogs.reduce(
    (sum, item) => sum + item.totalWeightKg * item.pricePerKg,
    0
  )

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Panen</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Pencatatan hasil panen per siklus, termasuk panen parsial bila diperlukan.
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
                <DialogTitle>Tambah Data Panen</DialogTitle>
                <DialogDescription>
                  Catatan panen akan tersimpan untuk siklus budidaya ini.
                </DialogDescription>
              </DialogHeader>
              <HarvestLogForm
                action={createHarvestLog}
                closeTargetId="create-harvest-log-dialog-close"
                cycleId={cycleId}
                submitLabel="Simpan Data Panen"
              />
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Jumlah Catatan" value={formatNumber(harvestLogs.length)} />
        <SummaryCard label="Total Berat Panen" value={`${formatNumber(totalWeight)} kg`} />
        <SummaryCard label="Estimasi Nilai Panen" value={formatCurrency(totalRevenue)} />
        <SummaryCard
          label="Panen Terakhir"
          value={harvestLogs[0] ? formatDate(harvestLogs[0].logDate) : "-"}
        />
      </div>

      <div className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
        <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">List Panen</h3>
            <p className="text-muted-foreground text-sm">
              Data panen yang sudah tercatat pada siklus ini.
            </p>
          </div>
          <span className="text-muted-foreground text-sm">
            {formatNumber(harvestLogs.length)} catatan
          </span>
        </div>

        {harvestLogs.length ? (
          <div className="divide-border divide-y">
            {harvestLogs.map((harvestLog) => {
              const revenue = harvestLog.totalWeightKg * harvestLog.pricePerKg

              return (
                <article
                  className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
                  key={harvestLog.id}
                >
                  <div className="min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-muted flex size-8 items-center justify-center rounded-md">
                        <PackageCheck className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate font-semibold">
                          {harvestLog.buyer || "Panen tanpa pembeli"}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {formatDate(harvestLog.logDate)}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {formatNumber(harvestLog.harvestedCount)} ekor /
                      {" "}
                      {formatNumber(harvestLog.totalWeightKg)} kg
                    </p>
                    {harvestLog.notes ? (
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {harvestLog.notes}
                      </p>
                    ) : null}
                  </div>

                  <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3 lg:grid-cols-1">
                    <Metric label="Harga / kg" value={formatCurrency(harvestLog.pricePerKg)} />
                    <Metric label="Nilai Panen" value={formatCurrency(revenue)} />
                    <Metric label="Dicatat" value={formatDate(harvestLog.createdAt)} />
                  </dl>

                  {canManage ? (
                    <CrudRowActions
                      deleteAction={deleteHarvestLog}
                      deleteDescription="Data panen yang dihapus tidak bisa dikembalikan untuk"
                      deleteHiddenFields={[{ name: "cycleId", value: cycleId }]}
                      detailContent={<HarvestLogDetailContent harvestLog={harvestLog} />}
                      detailDescription={formatDate(harvestLog.logDate)}
                      detailTitle={harvestLog.buyer || "Detail Panen"}
                      editContent={
                        <HarvestLogForm
                          action={updateHarvestLog}
                          closeTargetId={`edit-harvest-log-dialog-close-${harvestLog.id}`}
                          cycleId={cycleId}
                          harvestLog={harvestLog}
                          submitLabel="Simpan Perubahan"
                        />
                      }
                      editDescription="Perbarui data panen untuk siklus budidaya ini."
                      editTitle="Edit Data Panen"
                      itemId={harvestLog.id}
                      itemName={harvestLog.buyer || formatDate(harvestLog.logDate)}
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
                            <DialogTitle>{harvestLog.buyer || "Detail Panen"}</DialogTitle>
                            <DialogDescription>{formatDate(harvestLog.logDate)}</DialogDescription>
                          </DialogHeader>
                          <HarvestLogDetailContent harvestLog={harvestLog} />
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
            <h3 className="font-semibold">Belum ada catatan panen</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Tambahkan pencatatan panen pertama untuk siklus ini.
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
