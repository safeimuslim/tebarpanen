"use client"

import Link from "next/link"
import { useActionState, useEffect, useRef, useState } from "react"
import { CalendarDays, Eye, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { initialActionState } from "@/app/lib/action-state"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormSubmitButton } from "@/components/form-submit-button"
import { cn } from "@/lib/utils"

import { deleteCycle, updateCycle } from "../actions"
import type { CycleFormPondOption, CycleWithRelations } from "../types"
import {
  formatDate,
  formatNumber,
  getCycleStatusLabel,
  getSurvivalRate,
} from "../utils"
import { CycleForm } from "./cycle-form"

export function CycleList({
  availablePonds,
  canManageCycles,
  cycles,
}: {
  availablePonds: CycleFormPondOption[]
  canManageCycles: boolean
  cycles: CycleWithRelations[]
}) {
  if (cycles.length === 0) {
    return (
      <section className="border-border bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
        <h2 className="font-semibold">List Siklus Budidaya</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Belum ada siklus budidaya yang tersimpan.
        </p>
      </section>
    )
  }

  return (
    <section className="border-border bg-card text-card-foreground overflow-hidden rounded-lg border shadow-sm">
      <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">List Siklus Budidaya</h2>
          <p className="text-muted-foreground text-sm">
            Data siklus budidaya yang tersimpan di database.
          </p>
        </div>
        <span className="text-muted-foreground text-sm">
          {formatNumber(cycles.length)} siklus
        </span>
      </div>

      <div className="divide-border divide-y">
        {cycles.map((cycle) => (
          <CycleRow
            availablePonds={availablePonds}
            canManageCycles={canManageCycles}
            cycle={cycle}
            key={cycle.id}
          />
        ))}
      </div>
    </section>
  )
}

function CycleRow({
  availablePonds,
  canManageCycles,
  cycle,
}: {
  availablePonds: CycleFormPondOption[]
  canManageCycles: boolean
  cycle: CycleWithRelations
}) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const closeDeleteRef = useRef<HTMLButtonElement>(null)
  const [deleteState, deleteFormAction] = useActionState(
    deleteCycle,
    initialActionState
  )

  useEffect(() => {
    if (deleteState.status === "success") {
      toast.success(deleteState.message)
      closeDeleteRef.current?.click()
    }

    if (deleteState.status === "error") {
      toast.error(deleteState.message)
    }
  }, [deleteState])

  const deadCount = cycle.mortalityLogs.reduce((sum, log) => sum + log.deadCount, 0)
  const feedUsed = cycle.feedLogs.reduce((sum, log) => sum + log.quantityKg, 0)

  return (
    <>
      <article className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto]">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{cycle.cycleName}</h3>
            <span className="border-border bg-muted rounded-full border px-2 py-0.5 text-xs font-medium">
              {getCycleStatusLabel(cycle.status)}
            </span>
            {cycle.farm ? (
              <span className="border-border bg-background rounded-full border px-2 py-0.5 text-xs font-medium">
                {cycle.farm.name}
              </span>
            ) : null}
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <CalendarDays className="size-4" />
            Mulai {formatDate(cycle.startDate)}
          </div>
          <div className="flex flex-wrap gap-2">
            {cycle.ponds.map((pond) => (
              <span
                className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-xs"
                key={pond.id}
              >
                {pond.name}
              </span>
            ))}
            {cycle.targetHarvestDate ? (
              <span className="border-border bg-background rounded-md border px-2 py-1 text-xs">
                Target panen {formatDate(cycle.targetHarvestDate)}
              </span>
            ) : null}
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4 lg:grid-cols-1">
          <Metric label="Bibit" value={`${formatNumber(cycle.seedCount)} ekor`} />
          <Metric label="Kolam" value={`${formatNumber(cycle.ponds.length)} kolam`} />
          <Metric label="Pakan" value={`${formatNumber(feedUsed)} kg`} />
          <Metric
            label="Survival"
            value={getSurvivalRate(cycle.seedCount, deadCount)}
          />
        </dl>

        <div className="flex flex-wrap items-start gap-2 lg:justify-end">
          <Link
            className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-2")}
            href={`/siklus-budidaya/${cycle.id}`}
          >
            <Eye className="size-4" />
            Detail
          </Link>
          {canManageCycles ? (
            <>
              <Button
                className="gap-2"
                onClick={() => setEditOpen(true)}
                size="sm"
                type="button"
                variant="outline"
              >
                <Pencil className="size-4" />
                Edit
              </Button>
              <Button
                className="gap-2"
                onClick={() => setDeleteOpen(true)}
                size="sm"
                type="button"
                variant="destructive"
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </>
          ) : null}
        </div>
      </article>

      <Dialog onOpenChange={setEditOpen} open={editOpen}>
        <DialogContent
          className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto p-0 sm:max-w-3xl"
          showCloseButton={false}
        >
          <DialogHeader className="border-border border-b p-5">
            <p className="text-muted-foreground text-sm">Form Siklus</p>
            <DialogTitle>Edit Siklus Budidaya</DialogTitle>
            <DialogDescription>
              Perbarui data siklus dan pilih satu atau beberapa kolam yang masih tersedia.
            </DialogDescription>
          </DialogHeader>

          <CycleForm
            action={updateCycle}
            availablePonds={availablePonds}
            canEditStatus
            closeTargetId={`edit-cycle-dialog-close-${cycle.id}`}
            cycle={cycle}
            submitLabel="Simpan Perubahan"
          />
        </DialogContent>
      </Dialog>

      <AlertDialog onOpenChange={setDeleteOpen} open={deleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash2 className="size-5 text-destructive" />
            </AlertDialogMedia>
            <AlertDialogTitle>Hapus siklus?</AlertDialogTitle>
            <AlertDialogDescription>
              Siklus budidaya{" "}
              <span className="font-medium text-foreground">{cycle.cycleName}</span>{" "}
              akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel ref={closeDeleteRef}>Batal</AlertDialogCancel>
            <form action={deleteFormAction}>
              <input name="id" type="hidden" value={cycle.id} />
              <FormSubmitButton
                className="gap-2"
                pendingLabel="Menghapus..."
                type="submit"
                variant="destructive"
              >
                <Trash2 className="size-4" />
                Hapus
              </FormSubmitButton>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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
