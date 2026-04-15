import { Waves } from "lucide-react"

import { CrudRowActions } from "@/components/crud-row-actions"

import { deletePond, updatePond } from "../actions"
import { pondShapeLabels, pondStatusLabels, pondTypeLabels } from "../constants"
import type { PondFilters, PondFormData } from "../types"
import { formatCapacity, formatCurrency } from "../utils"
import { PondDetailContent } from "./pond-detail-content"
import { PondFiltersSection } from "./pond-filters"
import { PondForm } from "./pond-form"

export function PondList({
  filters,
  ponds,
  totalCount,
}: {
  filters: PondFilters
  ponds: PondFormData[]
  totalCount: number
}) {
  return (
    <section className="border-border bg-card text-card-foreground overflow-hidden rounded-lg border">
      <div className="border-border border-b">
        <PondFiltersSection embedded filters={filters} />
      </div>

      <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">List Kolam</h2>
          <p className="text-muted-foreground text-sm">
            Data master kolam yang sudah tersimpan di database.
          </p>
        </div>
        <span className="text-muted-foreground text-sm">
          {totalCount} kolam ditemukan
        </span>
      </div>

      {ponds.length ? (
        <div className="divide-border divide-y">
          {ponds.map((pond) => (
            <article
              className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
              key={pond.id}
            >
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                    <Waves className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{pond.name}</h3>
                    <p className="text-muted-foreground text-sm">{pond.code}</p>
                  </div>
                  <span className="border-border bg-muted rounded-full border px-2 py-0.5 text-xs font-medium">
                    {pondStatusLabels[pond.status]}
                  </span>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4 lg:grid-cols-1">
                <MasterMetric label="Jenis" value={pondTypeLabels[pond.type]} />
                <MasterMetric label="Bentuk" value={pondShapeLabels[pond.shape]} />
                <MasterMetric label="Kapasitas" value={formatCapacity(pond.capacity)} />
                <MasterMetric
                  label="Harga Pembelian"
                  value={formatCurrency(pond.purchasePrice)}
                />
              </dl>

              <CrudRowActions
                deleteAction={deletePond}
                deleteDescription="Data kolam yang dihapus tidak bisa dikembalikan untuk"
                detailContent={<PondDetailContent pond={pond} />}
                detailDescription={pond.code}
                detailTitle={pond.name}
                editContent={
                  <PondForm
                    action={updatePond}
                    closeTargetId={`edit-pond-dialog-close-${pond.id}`}
                    pond={pond}
                    submitLabel="Simpan Perubahan"
                  />
                }
                editDescription="Perbarui data kolam yang tersimpan di database."
                editTitle="Edit Kolam"
                itemId={pond.id}
                itemName={pond.name}
              />
            </article>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <div className="bg-muted mx-auto flex size-12 items-center justify-center rounded-lg">
            <Waves className="size-6" />
          </div>
          <h2 className="mt-4 font-semibold">Belum ada kolam</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Tambahkan kolam pertama untuk mulai menyusun data master.
          </p>
        </div>
      )}
    </section>
  )
}

function MasterMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  )
}
