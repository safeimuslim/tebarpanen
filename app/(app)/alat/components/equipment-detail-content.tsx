import { DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import {
  equipmentConditionLabels,
  equipmentTypeLabels,
} from "../constants"
import type { EquipmentFormData } from "../types"
import {
  formatCurrency,
  formatDateDisplay,
  formatDepreciationMonths,
  formatQuantity,
} from "../utils"

export function EquipmentDetailContent({
  equipment,
}: {
  equipment: EquipmentFormData
}) {
  return (
    <>
      <dl className="grid gap-4 p-5 md:grid-cols-2">
        <MasterMetric
          label="Jenis"
          value={equipmentTypeLabels[equipment.type]}
        />
        <MasterMetric
          label="Kondisi"
          value={equipmentConditionLabels[equipment.condition]}
        />
        <MasterMetric label="Jumlah" value={formatQuantity(equipment.quantity)} />
        <MasterMetric label="Merek" value={equipment.brand ?? "-"} />
        <MasterMetric label="Nomor Seri" value={equipment.serialNumber ?? "-"} />
        <MasterMetric
          label="Tanggal Kalibrasi"
          value={formatDateDisplay(equipment.calibrationDate)}
        />
        <MasterMetric
          label="Harga Pembelian"
          value={formatCurrency(equipment.purchasePrice)}
        />
        <MasterMetric
          label="Tanggal Pembelian"
          value={formatDateDisplay(equipment.purchasedAt)}
        />
        <MasterMetric
          label="Masa Penyusutan"
          value={formatDepreciationMonths(equipment.depreciationMonths)}
        />
        <div className="md:col-span-2">
          <MasterMetric label="Catatan" value={equipment.notes ?? "-"} />
        </div>
      </dl>
      <div className="border-border flex justify-end border-t p-5">
        <DialogClose render={<Button type="button" variant="outline" />}>
          Tutup
        </DialogClose>
      </div>
    </>
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
