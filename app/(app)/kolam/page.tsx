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
import { createPond } from "@/features/kolam/actions"
import { PondForm } from "@/features/kolam/components/pond-form"
import { PondList } from "@/features/kolam/components/pond-list"
import { PondSummaryCards } from "@/features/kolam/components/pond-summary-cards"
import { getPondPageData } from "@/features/kolam/queries"
import { ListPagination } from "@/shared/components/list-pagination"

export default async function KolamPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const {
    activeCount,
    currentPage,
    filters,
    maintenanceCount,
    ponds,
    totalCount,
    totalPages,
    totalPurchasePrice,
  } = await getPondPageData(searchParams)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Master Data</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Kolam</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Data kolam yang dapat dipilih saat membuat siklus budidaya.
          </p>
        </div>

        <Dialog>
          <DialogTrigger
            render={<Button className="gap-2" size="lg" type="button" />}
          >
            <Plus className="size-4" />
            Tambah Kolam
          </DialogTrigger>
          <DialogContent
            className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto p-0 sm:max-w-3xl"
            showCloseButton={false}
          >
            <DialogHeader className="border-border border-b p-5">
              <p className="text-muted-foreground text-sm">Form Master Data</p>
              <DialogTitle>Tambah Kolam</DialogTitle>
              <DialogDescription>
                Data kolam akan tersimpan ke database.
              </DialogDescription>
            </DialogHeader>

            <PondForm
              action={createPond}
              closeTargetId="create-pond-dialog-close"
              submitLabel="Simpan Kolam"
            />
          </DialogContent>
        </Dialog>
      </div>

      <PondSummaryCards
        activeCount={activeCount}
        maintenanceCount={maintenanceCount}
        totalCount={totalCount}
        totalPurchasePrice={totalPurchasePrice}
      />

      <PondList filters={filters} ponds={ponds} totalCount={totalCount} />

      <ListPagination
        currentPage={currentPage}
        pathname="/kolam"
        searchParams={{
          query: filters.query || undefined,
          shape: filters.shape,
          status: filters.status,
          type: filters.type,
        }}
        totalPages={totalPages}
      />
    </div>
  )
}
