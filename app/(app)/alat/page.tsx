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
import { createEquipment } from "@/features/alat/actions"
import { EquipmentForm } from "@/features/alat/components/equipment-form"
import { EquipmentList } from "@/features/alat/components/equipment-list"
import { EquipmentSummaryCards } from "@/features/alat/components/equipment-summary-cards"
import { getEquipmentPageData } from "@/features/alat/queries"
import { ListPagination } from "@/shared/components/list-pagination"

export default async function AlatPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const {
    currentPage,
    equipment,
    filters,
    needsCheckCount,
    readyCount,
    totalCount,
    totalPages,
    totalPurchasePrice,
  } = await getEquipmentPageData(searchParams)

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

      <EquipmentList
        equipment={equipment}
        filters={filters}
        totalCount={totalCount}
      />

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
