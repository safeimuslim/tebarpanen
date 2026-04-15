"use client"

import Link from "next/link"
import { useActionState, useEffect, useRef, useState } from "react"
import type { CycleStatus } from "@/app/generated/prisma/enums"
import {
  ArrowDownUp,
  CalendarDays,
  Eye,
  Pencil,
  Search,
  Trash2,
} from "lucide-react"
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
import { cycleStatusLabels } from "../constants"
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
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | CycleStatus>("ALL")
  const [sortBy, setSortBy] = useState<"latest" | "target-harvest" | "name">(
    "latest"
  )

  if (cycles.length === 0) {
    return (
      <section className="border-border bg-card text-card-foreground rounded-lg border p-8 text-center">
        <h2 className="font-semibold">Belum ada siklus budidaya</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Belum ada siklus budidaya yang tersimpan.
        </p>
        {canManageCycles ? (
          <p className="text-muted-foreground mt-1 text-sm">
            Gunakan tombol <span className="font-medium text-foreground">Tambah Siklus</span>{" "}
            di atas untuk membuat data pertama.
          </p>
        ) : null}
      </section>
    )
  }

  const normalizedQuery = query.trim().toLowerCase()
  const filteredAndSortedCycles = [...cycles]
    .filter((cycle) => {
      if (statusFilter !== "ALL" && cycle.status !== statusFilter) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

      const haystack = [
        cycle.cycleName,
        cycle.farm?.name,
        ...cycle.ponds.map((pond) => pond.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return haystack.includes(normalizedQuery)
    })
    .sort((left, right) => {
      if (sortBy === "name") {
        return left.cycleName.localeCompare(right.cycleName, "id-ID")
      }

      if (sortBy === "target-harvest") {
        const leftTarget = left.targetHarvestDate
          ? new Date(left.targetHarvestDate).getTime()
          : Number.POSITIVE_INFINITY
        const rightTarget = right.targetHarvestDate
          ? new Date(right.targetHarvestDate).getTime()
          : Number.POSITIVE_INFINITY

        if (leftTarget !== rightTarget) {
          return leftTarget - rightTarget
        }
      }

      return new Date(right.startDate).getTime() - new Date(left.startDate).getTime()
    })

  const visibleGroups = STATUS_ORDER.map((status) => ({
    count: filteredAndSortedCycles.filter((cycle) => cycle.status === status).length,
    cycles: filteredAndSortedCycles.filter((cycle) => cycle.status === status),
    status,
  })).filter((group) => group.cycles.length > 0)

  const hasActiveFilters =
    normalizedQuery.length > 0 || statusFilter !== "ALL" || sortBy !== "latest"

  return (
    <section className="border-border bg-card text-card-foreground overflow-hidden rounded-lg border">
      <div className="border-border space-y-4 border-b p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Daftar Siklus</h2>
            <p className="text-muted-foreground text-sm">
              Cari, filter, dan buka siklus yang perlu ditindak lebih dulu.
            </p>
          </div>
          <span className="text-muted-foreground text-sm">
            {formatNumber(filteredAndSortedCycles.length)} dari {formatNumber(cycles.length)} siklus
          </span>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_15rem_15rem_auto]">
          <label className="relative block">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border pr-3 pl-9 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama siklus, farm, atau kolam"
              value={query}
            />
          </label>

          <select
            className="border-input bg-white text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
            onChange={(event) =>
              setStatusFilter(event.target.value as "ALL" | CycleStatus)
            }
            value={statusFilter}
          >
            <option value="ALL">Semua status</option>
            {STATUS_ORDER.map((status) => (
              <option key={status} value={status}>
                {cycleStatusLabels[status]}
              </option>
            ))}
          </select>

          <label className="relative block">
            <ArrowDownUp className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <select
              className="border-input bg-white text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border pr-3 pl-9 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
              onChange={(event) =>
                setSortBy(
                  event.target.value as "latest" | "target-harvest" | "name"
                )
              }
              value={sortBy}
            >
              <option value="latest">Urutkan: Terbaru</option>
              <option value="target-harvest">Urutkan: Target panen</option>
              <option value="name">Urutkan: Nama A-Z</option>
            </select>
          </label>

          <Button
            onClick={() => {
              setQuery("")
              setStatusFilter("ALL")
              setSortBy("latest")
            }}
            type="button"
            variant="outline"
          >
            Reset
          </Button>
        </div>
      </div>

      {visibleGroups.length === 0 ? (
        <div className="p-8 text-center">
          <h3 className="font-medium">Tidak ada siklus yang cocok</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Ubah kata kunci, status, atau urutan untuk melihat data lain.
          </p>
          {hasActiveFilters ? (
            <Button
              className="mt-4"
              onClick={() => {
                setQuery("")
                setStatusFilter("ALL")
                setSortBy("latest")
              }}
              type="button"
              variant="outline"
            >
              Bersihkan Filter
            </Button>
          ) : null}
        </div>
      ) : (
        <div>
          {visibleGroups.map((group, index) => (
            <div
              className={cn(index > 0 && "border-border border-t")}
              key={group.status}
            >
              <div className="bg-muted/40 border-border flex items-center justify-between border-b px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex size-2.5 rounded-full",
                      getStatusDotClassName(group.status)
                    )}
                  />
                  <p className="text-sm font-medium">
                    {cycleStatusLabels[group.status]}
                  </p>
                </div>
                <span className="text-muted-foreground text-sm">
                  {formatNumber(group.count)} siklus
                </span>
              </div>

              <div className="divide-border divide-y">
                {group.cycles.map((cycle) => (
                  <CycleRow
                    availablePonds={availablePonds}
                    canManageCycles={canManageCycles}
                    cycle={cycle}
                    key={cycle.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
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
  const pondSummary = getPondSummary(cycle.ponds.map((pond) => pond.name))
  const targetHarvestText = cycle.targetHarvestDate
    ? `Target ${formatDate(cycle.targetHarvestDate)}`
    : "Target panen belum diatur"

  return (
    <>
      <article className="grid gap-4 px-4 py-5 transition-colors hover:bg-muted/20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center sm:px-5">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{cycle.cycleName}</h3>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                getStatusBadgeClassName(cycle.status)
              )}
            >
              {getCycleStatusLabel(cycle.status)}
            </span>
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4" />
              Mulai {formatDate(cycle.startDate)}
            </span>
            <span>{targetHarvestText}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <p className="text-foreground font-medium">{pondSummary}</p>
            <p className="text-muted-foreground">
              {formatNumber(cycle.ponds.length)} kolam terhubung
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3 lg:max-w-xl">
            <Metric label="Bibit" value={`${formatNumber(cycle.seedCount)} ekor`} />
            <Metric
              label="Survival"
              value={getSurvivalRate(cycle.seedCount, deadCount)}
            />
            <Metric
              label="Kolam"
              value={`${formatNumber(cycle.ponds.length)} kolam`}
            />
          </dl>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "gap-2 whitespace-nowrap"
            )}
            href={`/siklus-budidaya/${cycle.id}`}
          >
            <Eye className="size-4" />
            Detail
          </Link>

          {canManageCycles ? (
            <>
              <Button
                className="gap-2 whitespace-nowrap"
                onClick={() => setEditOpen(true)}
                type="button"
                variant="outline"
              >
                <Pencil className="size-4" />
                Edit
              </Button>
              <Button
                className="gap-2 whitespace-nowrap"
                onClick={() => setDeleteOpen(true)}
                type="button"
                variant="destructive"
              >
                <Trash2 className="size-4" />
                Hapus
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
    <div className="border-border bg-white rounded-lg border px-3 py-2.5">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-1 text-sm font-semibold">{value}</dd>
    </div>
  )
}

const STATUS_ORDER: CycleStatus[] = ["ACTIVE", "HARVESTED", "CLOSED", "FAILED"]

function getPondSummary(pondNames: string[]) {
  if (pondNames.length === 0) {
    return "Belum ada kolam"
  }

  if (pondNames.length <= 2) {
    return pondNames.join(", ")
  }

  return `${pondNames.slice(0, 2).join(", ")} +${pondNames.length - 2}`
}

function getStatusBadgeClassName(status: CycleStatus) {
  switch (status) {
    case "ACTIVE":
      return "bg-primary/10 text-primary"
    case "HARVESTED":
      return "bg-secondary/10 text-secondary"
    case "FAILED":
      return "bg-destructive/10 text-destructive"
    case "CLOSED":
      return "bg-muted text-foreground"
  }
}

function getStatusDotClassName(status: CycleStatus) {
  switch (status) {
    case "ACTIVE":
      return "bg-primary"
    case "HARVESTED":
      return "bg-secondary"
    case "FAILED":
      return "bg-destructive"
    case "CLOSED":
      return "bg-muted-foreground"
  }
}
