"use client"

import { AlertTriangle, Plus } from "lucide-react"

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
  createMortalityLog,
  deleteMortalityLog,
  updateMortalityLog,
} from "../actions"
import type { MortalityLogItem } from "../types"
import { formatDate, formatNumber } from "../../utils"
import { MortalityLogDetailContent } from "./mortality-log-detail-content"
import { MortalityLogForm } from "./mortality-log-form"

export function MortalityLogSection({
  canManage,
  cycleId,
  mortalityLogs,
}: {
  canManage: boolean
  cycleId: string
  mortalityLogs: MortalityLogItem[]
}) {
  const totalDead = mortalityLogs.reduce((sum, item) => sum + item.deadCount, 0)

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Mortalitas</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Pencatatan kematian ikan untuk siklus ini.
          </p>
        </div>

        {canManage ? (
          <Dialog>
            <DialogTrigger
              render={<Button className="gap-2" type="button" variant="default" />}
            >
              <Plus className="size-4" />
              Tambah Mortalitas
            </DialogTrigger>
            <DialogContent
              className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto p-0 sm:max-w-2xl"
              showCloseButton={false}
            >
              <DialogHeader className="border-border border-b p-5">
                <p className="text-muted-foreground text-sm">Form Operasional Siklus</p>
                <DialogTitle>Tambah Data Mortalitas</DialogTitle>
                <DialogDescription>
                  Catatan mortalitas akan tersimpan untuk siklus budidaya ini.
                </DialogDescription>
              </DialogHeader>
              <MortalityLogForm
                action={createMortalityLog}
                closeTargetId="create-mortality-log-dialog-close"
                cycleId={cycleId}
                submitLabel="Simpan Data Mortalitas"
              />
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SummaryCard label="Jumlah Catatan" value={formatNumber(mortalityLogs.length)} />
        <SummaryCard label="Total Kematian" value={`${formatNumber(totalDead)} ekor`} />
      </div>

      <div className="border-border bg-card overflow-hidden rounded-lg border">
        <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">List Mortalitas</h3>
            <p className="text-muted-foreground text-sm">
              Data kematian ikan yang sudah tercatat pada siklus ini.
            </p>
          </div>
          <span className="text-muted-foreground text-sm">
            {formatNumber(mortalityLogs.length)} catatan
          </span>
        </div>

        {mortalityLogs.length ? (
          <div className="divide-border divide-y">
            {mortalityLogs.map((mortalityLog) => (
              <article
                className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
                key={mortalityLog.id}
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted flex size-8 items-center justify-center rounded-md">
                      <AlertTriangle className="size-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {formatNumber(mortalityLog.deadCount)} ekor mati
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {formatDate(mortalityLog.logDate)}
                      </p>
                    </div>
                  </div>
                  {mortalityLog.cause ? (
                    <p className="text-muted-foreground text-sm">
                      {mortalityLog.cause}
                    </p>
                  ) : null}
                  {mortalityLog.notes ? (
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {mortalityLog.notes}
                    </p>
                  ) : null}
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3 lg:grid-cols-1">
                  <Metric
                    label="Jumlah"
                    value={`${formatNumber(mortalityLog.deadCount)} ekor`}
                  />
                  <Metric label="Gejala" value={mortalityLog.cause || "-"} />
                  <Metric label="Dicatat" value={formatDate(mortalityLog.createdAt)} />
                </dl>

                {canManage ? (
                  <CrudRowActions
                    deleteAction={deleteMortalityLog}
                    deleteDescription="Data mortalitas yang dihapus tidak bisa dikembalikan untuk"
                    deleteHiddenFields={[{ name: "cycleId", value: cycleId }]}
                    detailContent={<MortalityLogDetailContent mortalityLog={mortalityLog} />}
                    detailDescription={formatDate(mortalityLog.logDate)}
                    detailTitle={`${formatNumber(mortalityLog.deadCount)} ekor mati`}
                    editContent={
                      <MortalityLogForm
                        action={updateMortalityLog}
                        closeTargetId={`edit-mortality-log-dialog-close-${mortalityLog.id}`}
                        cycleId={cycleId}
                        mortalityLog={mortalityLog}
                        submitLabel="Simpan Perubahan"
                      />
                    }
                    editDescription="Perbarui data mortalitas untuk siklus budidaya ini."
                    editTitle="Edit Data Mortalitas"
                    itemId={mortalityLog.id}
                    itemName={`${formatNumber(mortalityLog.deadCount)} ekor mati`}
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
                          <p className="text-muted-foreground text-sm">Detail Mortalitas</p>
                          <DialogTitle>{formatNumber(mortalityLog.deadCount)} ekor mati</DialogTitle>
                          <DialogDescription>{formatDate(mortalityLog.logDate)}</DialogDescription>
                        </DialogHeader>
                        <MortalityLogDetailContent mortalityLog={mortalityLog} />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="font-semibold">Belum ada catatan mortalitas</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Tambahkan pencatatan mortalitas pertama untuk siklus ini.
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
