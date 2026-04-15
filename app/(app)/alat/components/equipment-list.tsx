import { Wrench } from "lucide-react"

import { CrudRowActions } from "@/components/crud-row-actions"

import { deleteEquipment, updateEquipment } from "../actions"
import {
  equipmentConditionLabels,
  equipmentTypeLabels,
} from "../constants"
import type { EquipmentFormData } from "../types"
import {
  formatCurrency,
  formatDateDisplay,
  formatQuantity,
} from "../utils"
import { EquipmentDetailContent } from "./equipment-detail-content"
import { EquipmentForm } from "./equipment-form"

export function EquipmentList({
  equipment,
  totalCount,
}: {
  equipment: EquipmentFormData[]
  totalCount: number
}) {
  return (
    <section className="border-border bg-card text-card-foreground overflow-hidden rounded-lg border">
      <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">List Alat</h2>
          <p className="text-muted-foreground text-sm">
            Data master alat yang sudah tersimpan di database.
          </p>
        </div>
        <span className="text-muted-foreground text-sm">
          {totalCount} alat ditemukan
        </span>
      </div>

      {equipment.length ? (
        <div className="divide-border divide-y">
          {equipment.map((item) => (
            <article
              className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
              key={item.id}
            >
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                    <Wrench className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {equipmentTypeLabels[item.type]}
                    </p>
                  </div>
                  <span className="border-border bg-muted rounded-full border px-2 py-0.5 text-xs font-medium">
                    {equipmentConditionLabels[item.condition]}
                  </span>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4 lg:grid-cols-1">
                <MasterMetric label="Jenis" value={equipmentTypeLabels[item.type]} />
                <MasterMetric label="Jumlah" value={formatQuantity(item.quantity)} />
                <MasterMetric
                  label="Kalibrasi"
                  value={formatDateDisplay(item.calibrationDate)}
                />
                <MasterMetric
                  label="Harga Pembelian"
                  value={formatCurrency(item.purchasePrice)}
                />
              </dl>

              <CrudRowActions
                deleteAction={deleteEquipment}
                deleteDescription="Data alat yang dihapus tidak bisa dikembalikan untuk"
                detailContent={<EquipmentDetailContent equipment={item} />}
                detailDescription={equipmentTypeLabels[item.type]}
                detailTitle={item.name}
                editContent={
                  <EquipmentForm
                    action={updateEquipment}
                    closeTargetId={`edit-equipment-dialog-close-${item.id}`}
                    equipment={item}
                    submitLabel="Simpan Perubahan"
                  />
                }
                editDescription="Perbarui data alat yang tersimpan di database."
                editTitle="Edit Alat"
                itemId={item.id}
                itemName={item.name}
              />
            </article>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <div className="bg-muted mx-auto flex size-12 items-center justify-center rounded-lg">
            <Wrench className="size-6" />
          </div>
          <h2 className="mt-4 font-semibold">Belum ada alat</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Tambahkan alat pertama untuk mulai menyusun data master.
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
