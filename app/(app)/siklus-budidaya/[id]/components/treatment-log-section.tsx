"use client"

import { Pill, Plus } from "lucide-react"

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

import {
  createTreatmentLog,
  deleteTreatmentLog,
  updateTreatmentLog,
} from "../actions"
import type { TreatmentLogItem } from "../types"
import { formatDate, formatNumber } from "../../utils"
import { TreatmentLogDetailContent } from "./treatment-log-detail-content"
import { TreatmentLogForm } from "./treatment-log-form"

export function TreatmentLogSection({
  canManage,
  cycleId,
  treatmentLogs,
}: {
  canManage: boolean
  cycleId: string
  treatmentLogs: TreatmentLogItem[]
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Pengobatan</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Pencatatan obat, vitamin, atau tindakan pengobatan untuk siklus ini.
          </p>
        </div>

        {canManage ? (
          <Dialog>
            <DialogTrigger
              render={<Button className="gap-2" type="button" variant="default" />}
            >
              <Plus className="size-4" />
              Tambah Pengobatan
            </DialogTrigger>
            <DialogContent
              className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto p-0 sm:max-w-2xl"
              showCloseButton={false}
            >
              <DialogHeader className="border-border border-b p-5">
                <p className="text-muted-foreground text-sm">Form Operasional Siklus</p>
                <DialogTitle>Tambah Data Pengobatan</DialogTitle>
                <DialogDescription>
                  Catatan pengobatan akan tersimpan untuk siklus budidaya ini.
                </DialogDescription>
              </DialogHeader>
              <TreatmentLogForm
                action={createTreatmentLog}
                closeTargetId="create-treatment-log-dialog-close"
                cycleId={cycleId}
                submitLabel="Simpan Data Pengobatan"
              />
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SummaryCard label="Jumlah Catatan" value={formatNumber(treatmentLogs.length)} />
        <SummaryCard
          label="Catatan Terakhir"
          value={treatmentLogs[0] ? formatDate(treatmentLogs[0].logDate) : "-"}
        />
      </div>

      <div className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
        <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">List Pengobatan</h3>
            <p className="text-muted-foreground text-sm">
              Data pengobatan yang sudah tercatat pada siklus ini.
            </p>
          </div>
          <span className="text-muted-foreground text-sm">
            {formatNumber(treatmentLogs.length)} catatan
          </span>
        </div>

        {treatmentLogs.length ? (
          <div className="divide-border divide-y">
            {treatmentLogs.map((log) => (
              <article
                className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
                key={log.id}
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted flex size-8 items-center justify-center rounded-md">
                      <Pill className="size-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{log.productName}</h4>
                      <p className="text-muted-foreground text-sm">
                        {formatDate(log.logDate)}
                      </p>
                    </div>
                  </div>
                  {log.purpose ? (
                    <p className="text-muted-foreground text-sm">{log.purpose}</p>
                  ) : null}
                  {log.notes ? (
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {log.notes}
                    </p>
                  ) : null}
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3 lg:grid-cols-1">
                  <Metric label="Dosis" value={log.dosage || "-"} />
                  <Metric label="Tujuan" value={log.purpose || "-"} />
                  <Metric label="Dicatat" value={formatDate(log.createdAt)} />
                </dl>

                {canManage ? (
                  <CrudRowActions
                    deleteAction={deleteTreatmentLog}
                    deleteDescription="Data pengobatan yang dihapus tidak bisa dikembalikan untuk"
                    deleteHiddenFields={[{ name: "cycleId", value: cycleId }]}
                    detailContent={<TreatmentLogDetailContent treatmentLog={log} />}
                    detailDescription={formatDate(log.logDate)}
                    detailTitle={log.productName}
                    editContent={
                      <TreatmentLogForm
                        action={updateTreatmentLog}
                        closeTargetId={`edit-treatment-log-dialog-close-${log.id}`}
                        cycleId={cycleId}
                        submitLabel="Simpan Perubahan"
                        treatmentLog={log}
                      />
                    }
                    editDescription="Perbarui data pengobatan untuk siklus budidaya ini."
                    editTitle="Edit Data Pengobatan"
                    itemId={log.id}
                    itemName={log.productName}
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
                          <p className="text-muted-foreground text-sm">Detail Pengobatan</p>
                          <DialogTitle>{log.productName}</DialogTitle>
                          <DialogDescription>{formatDate(log.logDate)}</DialogDescription>
                        </DialogHeader>
                        <TreatmentLogDetailContent treatmentLog={log} />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="font-semibold">Belum ada catatan pengobatan</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Tambahkan pencatatan pengobatan pertama untuk siklus ini.
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
