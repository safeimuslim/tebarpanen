import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { createCycle } from "../actions"
import type { CyclePageData } from "../types"
import { CycleForm } from "./cycle-form"
import { CycleList } from "./cycle-list"
import { CycleSummaryCards } from "./cycle-summary-cards"

export function CyclePage({
  activeCount,
  availablePonds,
  canManageCycles,
  cycles,
  totalEstimatedAlive,
  totalPondsUsed,
}: CyclePageData) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Siklus Budidaya</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Siklus Budidaya
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Kelola siklus budidaya dengan satu atau beberapa kolam. Kolam yang sedang
            dipakai dalam siklus aktif tidak dapat dipilih untuk siklus aktif baru.
          </p>
        </div>

        {canManageCycles ? (
          <Dialog>
            <DialogTrigger
              render={<Button className="gap-2" size="lg" type="button" />}
            >
              <Plus className="size-4" />
              Create Siklus Budidaya
            </DialogTrigger>
            <DialogContent
              className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto p-0 sm:max-w-3xl"
              showCloseButton={false}
            >
              <DialogHeader className="border-border border-b p-5">
                <p className="text-muted-foreground text-sm">Form Siklus</p>
                <DialogTitle>Create Siklus Budidaya</DialogTitle>
                <DialogDescription>
                  Siklus baru akan tersimpan ke database dengan satu atau beberapa kolam.
                </DialogDescription>
              </DialogHeader>

              <CycleForm
                action={createCycle}
                availablePonds={availablePonds}
                closeTargetId="create-cycle-dialog-close"
                submitLabel="Simpan Siklus"
              />
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <CycleSummaryCards
        activeCount={activeCount}
        totalEstimatedAlive={totalEstimatedAlive}
        totalPondsUsed={totalPondsUsed}
      />

      <CycleList
        availablePonds={availablePonds}
        canManageCycles={canManageCycles}
        cycles={cycles}
      />
    </div>
  )
}
