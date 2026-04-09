import { Plus } from "lucide-react"

import { ListPagination } from "@/components/list-pagination"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { createEquipment } from "../actions"
import type { EquipmentPageData } from "../types"
import { EquipmentFiltersSection } from "./equipment-filters"
import { EquipmentForm } from "./equipment-form"
import { EquipmentList } from "./equipment-list"
import { EquipmentSummaryCards } from "./equipment-summary-cards"

export function EquipmentPage({
  currentPage,
  equipment,
  filters,
  needsCheckCount,
  readyCount,
  totalCount,
  totalPages,
  totalPurchasePrice,
}: EquipmentPageData) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Master Data</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Alat</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Data alat yang dimiliki untuk operasional budidaya dan pencatatan.
          </p>
        </div>

        <Dialog>
          <DialogTrigger
            render={<Button className="gap-2" size="lg" type="button" />}
          >
            <Plus className="size-4" />
            Tambah Alat
          </DialogTrigger>
          <DialogContent
            className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto p-0 sm:max-w-3xl"
            showCloseButton={false}
          >
            <DialogHeader className="border-border border-b p-5">
              <p className="text-muted-foreground text-sm">Form Master Data</p>
              <DialogTitle>Tambah Alat</DialogTitle>
              <DialogDescription>
                Data alat akan tersimpan ke database.
              </DialogDescription>
            </DialogHeader>

            <EquipmentForm
              action={createEquipment}
              closeTargetId="create-equipment-dialog-close"
              submitLabel="Simpan Alat"
            />
          </DialogContent>
        </Dialog>
      </div>

      <EquipmentSummaryCards
        needsCheckCount={needsCheckCount}
        readyCount={readyCount}
        totalCount={totalCount}
        totalPurchasePrice={totalPurchasePrice}
      />

      <EquipmentFiltersSection filters={filters} />

      <EquipmentList equipment={equipment} totalCount={totalCount} />

      <ListPagination
        currentPage={currentPage}
        pathname="/alat"
        searchParams={{
          condition: filters.condition,
          query: filters.query || undefined,
          type: filters.type,
        }}
        totalPages={totalPages}
      />
    </div>
  )
}
