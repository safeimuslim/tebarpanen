"use client"

import { Droplets, Plus } from "lucide-react"

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

import {
  createWaterQualityLog,
  deleteWaterQualityLog,
  updateWaterQualityLog,
} from "../actions"
import type { WaterQualityLogItem } from "../types"
import { formatDate, formatNumber } from "../../utils"
import { WaterQualityLogDetailContent } from "./water-quality-log-detail-content"
import { WaterQualityLogForm } from "./water-quality-log-form"

export function WaterQualityLogSection({
  canManage,
  cycleId,
  waterQualityLogs,
}: {
  canManage: boolean
  cycleId: string
  waterQualityLogs: WaterQualityLogItem[]
}) {
  const latestLog = waterQualityLogs[0]

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Kualitas Air</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Pencatatan kualitas air untuk siklus budidaya ini.
          </p>
        </div>

        {canManage ? (
          <Dialog>
            <DialogTrigger
              render={<Button className="gap-2" type="button" variant="default" />}
            >
              <Plus className="size-4" />
              Tambah Kualitas Air
            </DialogTrigger>
            <DialogContent
              className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto p-0 sm:max-w-2xl"
              showCloseButton={false}
            >
              <DialogHeader className="border-border border-b p-5">
                <p className="text-muted-foreground text-sm">Form Operasional Siklus</p>
                <DialogTitle>Tambah Data Kualitas Air</DialogTitle>
                <DialogDescription>
                  Catatan kualitas air akan tersimpan untuk siklus budidaya ini.
                </DialogDescription>
              </DialogHeader>
              <WaterQualityLogForm
                action={createWaterQualityLog}
                closeTargetId="create-water-quality-log-dialog-close"
                cycleId={cycleId}
                submitLabel="Simpan Data Kualitas Air"
              />
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Jumlah Catatan" value={formatNumber(waterQualityLogs.length)} />
        <SummaryCard label="pH Terakhir" value={formatMetric(latestLog?.ph)} />
        <SummaryCard
          label="DO Terakhir"
          value={latestLog?.doMgL != null ? `${formatNumber(latestLog.doMgL)} mg/L` : "-"}
        />
        <SummaryCard
          label="Suhu Terakhir"
          value={latestLog?.temperatureC != null ? `${formatNumber(latestLog.temperatureC)} °C` : "-"}
        />
      </div>

      <div className="border-border bg-card overflow-hidden rounded-lg border">
        <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">List Kualitas Air</h3>
            <p className="text-muted-foreground text-sm">
              Data kualitas air yang sudah tercatat pada siklus ini.
            </p>
          </div>
          <span className="text-muted-foreground text-sm">
            {formatNumber(waterQualityLogs.length)} catatan
          </span>
        </div>

        {waterQualityLogs.length ? (
          <div className="divide-border divide-y">
            {waterQualityLogs.map((log) => (
              <article
                className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
                key={log.id}
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted flex size-8 items-center justify-center rounded-md">
                      <Droplets className="size-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{formatDate(log.logDate)}</h4>
                      <p className="text-muted-foreground text-sm">
                        {log.waterColor || "Tanpa warna air"}
                      </p>
                    </div>
                  </div>
                  {log.notes ? (
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {log.notes}
                    </p>
                  ) : null}
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4 lg:grid-cols-1">
                  <Metric label="pH" value={formatMetric(log.ph)} />
                  <Metric
                    label="Suhu"
                    value={log.temperatureC != null ? `${formatNumber(log.temperatureC)} °C` : "-"}
                  />
                  <Metric
                    label="DO"
                    value={log.doMgL != null ? `${formatNumber(log.doMgL)} mg/L` : "-"}
                  />
                  <Metric
                    label="Amonia"
                    value={log.ammoniaMgL != null ? `${formatNumber(log.ammoniaMgL)} mg/L` : "-"}
                  />
                </dl>

                {canManage ? (
                  <CrudRowActions
                    deleteAction={deleteWaterQualityLog}
                    deleteDescription="Data kualitas air yang dihapus tidak bisa dikembalikan untuk"
                    deleteHiddenFields={[{ name: "cycleId", value: cycleId }]}
                    detailContent={<WaterQualityLogDetailContent waterQualityLog={log} />}
                    detailDescription={formatDate(log.logDate)}
                    detailTitle={`Kualitas Air ${formatDate(log.logDate)}`}
                    editContent={
                      <WaterQualityLogForm
                        action={updateWaterQualityLog}
                        closeTargetId={`edit-water-quality-log-dialog-close-${log.id}`}
                        cycleId={cycleId}
                        submitLabel="Simpan Perubahan"
                        waterQualityLog={log}
                      />
                    }
                    editDescription="Perbarui data kualitas air untuk siklus budidaya ini."
                    editTitle="Edit Data Kualitas Air"
                    itemId={log.id}
                    itemName={`Kualitas Air ${formatDate(log.logDate)}`}
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
                          <p className="text-muted-foreground text-sm">Detail Kualitas Air</p>
                          <DialogTitle>{formatDate(log.logDate)}</DialogTitle>
                          <DialogDescription>{log.waterColor || "Tanpa warna air"}</DialogDescription>
                        </DialogHeader>
                        <WaterQualityLogDetailContent waterQualityLog={log} />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="font-semibold">Belum ada catatan kualitas air</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Tambahkan pencatatan kualitas air pertama untuk siklus ini.
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

function formatMetric(value?: number | null) {
  return value != null ? formatNumber(value) : "-"
}
