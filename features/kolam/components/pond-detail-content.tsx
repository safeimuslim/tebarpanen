import { DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { pondShapeLabels, pondStatusLabels, pondTypeLabels } from "../constants"
import type { PondFormData } from "../types"
import {
  formatCapacity,
  formatCurrency,
  formatDateDisplay,
  formatDepreciationMonths,
  formatPondSize,
} from "../utils"

export function PondDetailContent({ pond }: { pond: PondFormData }) {
  return (
    <>
      <dl className="grid gap-4 p-5 md:grid-cols-2">
        <MasterMetric label="Kode" value={pond.code} />
        <MasterMetric label="Jenis" value={pondTypeLabels[pond.type]} />
        <MasterMetric label="Bentuk" value={pondShapeLabels[pond.shape]} />
        <MasterMetric label="Status" value={pondStatusLabels[pond.status]} />
        <MasterMetric label="Dimensi" value={formatPondSize(pond)} />
        <MasterMetric label="Kapasitas" value={formatCapacity(pond.capacity)} />
        <MasterMetric
          label="Harga Pembelian"
          value={formatCurrency(pond.purchasePrice)}
        />
        <MasterMetric
          label="Tanggal Pasang"
          value={formatDateDisplay(pond.installedAt)}
        />
        <MasterMetric
          label="Masa Penyusutan"
          value={formatDepreciationMonths(pond.depreciationMonths)}
        />
        <div className="md:col-span-2">
          <MasterMetric label="Catatan" value={pond.notes ?? "-"} />
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
