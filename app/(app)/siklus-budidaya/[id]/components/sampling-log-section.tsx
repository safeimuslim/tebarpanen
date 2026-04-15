"use client"

import { Ruler, Plus } from "lucide-react"

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
  createSamplingLog,
  deleteSamplingLog,
  updateSamplingLog,
} from "../actions"
import type { SamplingLogItem } from "../types"
import { formatDate, formatNumber } from "../../utils"
import { SamplingLogDetailContent } from "./sampling-log-detail-content"
import { SamplingLogForm } from "./sampling-log-form"

export function SamplingLogSection({
  canManage,
  cycleId,
  samplingLogs,
}: {
  canManage: boolean
  cycleId: string
  samplingLogs: SamplingLogItem[]
}) {
  const latestSampling = samplingLogs[0]

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Sampling</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Pencatatan pertumbuhan dan kondisi ikan pada siklus ini.
          </p>
        </div>

        {canManage ? (
          <Dialog>
            <DialogTrigger
              render={<Button className="gap-2" type="button" variant="default" />}
            >
              <Plus className="size-4" />
              Tambah Sampling
            </DialogTrigger>
            <DialogContent
              className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto p-0 sm:max-w-2xl"
              showCloseButton={false}
            >
              <DialogHeader className="border-border border-b p-5">
                <p className="text-muted-foreground text-sm">Form Operasional Siklus</p>
                <DialogTitle>Tambah Data Sampling</DialogTitle>
                <DialogDescription>
                  Catatan sampling akan tersimpan untuk siklus budidaya ini.
                </DialogDescription>
              </DialogHeader>
              <SamplingLogForm
                action={createSamplingLog}
                closeTargetId="create-sampling-log-dialog-close"
                cycleId={cycleId}
                submitLabel="Simpan Data Sampling"
              />
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Jumlah Catatan" value={formatNumber(samplingLogs.length)} />
        <SummaryCard
          label="Berat Terakhir"
          value={
            latestSampling?.averageWeightG != null
              ? `${formatNumber(latestSampling.averageWeightG)} g`
              : "-"
          }
        />
        <SummaryCard
          label="Panjang Terakhir"
          value={
            latestSampling?.averageLengthCm != null
              ? `${formatNumber(latestSampling.averageLengthCm)} cm`
              : "-"
          }
        />
      </div>

      <div className="border-border bg-card overflow-hidden rounded-lg border">
        <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">List Sampling</h3>
            <p className="text-muted-foreground text-sm">
              Data sampling yang sudah tercatat pada siklus ini.
            </p>
          </div>
          <span className="text-muted-foreground text-sm">
            {formatNumber(samplingLogs.length)} catatan
          </span>
        </div>

        {samplingLogs.length ? (
          <div className="divide-border divide-y">
            {samplingLogs.map((samplingLog) => (
              <article
                className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
                key={samplingLog.id}
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted flex size-8 items-center justify-center rounded-md">
                      <Ruler className="size-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{formatDate(samplingLog.logDate)}</h4>
                      <p className="text-muted-foreground text-sm">
                        {formatNumber(samplingLog.sampleCount)} sampel
                      </p>
                    </div>
                  </div>
                  {samplingLog.notes ? (
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {samplingLog.notes}
                    </p>
                  ) : null}
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3 lg:grid-cols-1">
                  <Metric
                    label="Berat"
                    value={`${formatNumber(samplingLog.averageWeightG)} g`}
                  />
                  <Metric
                    label="Panjang"
                    value={`${formatNumber(samplingLog.averageLengthCm)} cm`}
                  />
                  <Metric
                    label="Sampel"
                    value={`${formatNumber(samplingLog.sampleCount)} ekor`}
                  />
                </dl>

                {canManage ? (
                  <CrudRowActions
                    deleteAction={deleteSamplingLog}
                    deleteDescription="Data sampling yang dihapus tidak bisa dikembalikan untuk"
                    deleteHiddenFields={[{ name: "cycleId", value: cycleId }]}
                    detailContent={<SamplingLogDetailContent samplingLog={samplingLog} />}
                    detailDescription={formatDate(samplingLog.logDate)}
                    detailTitle={`Sampling ${formatDate(samplingLog.logDate)}`}
                    editContent={
                      <SamplingLogForm
                        action={updateSamplingLog}
                        closeTargetId={`edit-sampling-log-dialog-close-${samplingLog.id}`}
                        cycleId={cycleId}
                        samplingLog={samplingLog}
                        submitLabel="Simpan Perubahan"
                      />
                    }
                    editDescription="Perbarui data sampling untuk siklus budidaya ini."
                    editTitle="Edit Data Sampling"
                    itemId={samplingLog.id}
                    itemName={`Sampling ${formatDate(samplingLog.logDate)}`}
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
                          <p className="text-muted-foreground text-sm">Detail Sampling</p>
                          <DialogTitle>{formatDate(samplingLog.logDate)}</DialogTitle>
                          <DialogDescription>
                            {formatNumber(samplingLog.sampleCount)} sampel
                          </DialogDescription>
                        </DialogHeader>
                        <SamplingLogDetailContent samplingLog={samplingLog} />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="font-semibold">Belum ada catatan sampling</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Tambahkan pencatatan sampling pertama untuk siklus ini.
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
