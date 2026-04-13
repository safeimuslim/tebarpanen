import type { TreatmentLogItem } from "../types"
import { formatDate } from "../../utils"

export function TreatmentLogDetailContent({
  treatmentLog,
}: {
  treatmentLog: TreatmentLogItem
}) {
  return (
    <div className="grid gap-4 p-5 text-sm md:grid-cols-2">
      <DetailItem label="Tanggal" value={formatDate(treatmentLog.logDate)} />
      <DetailItem label="Nama Obat / Vitamin" value={treatmentLog.productName} />
      <DetailItem label="Dosis" value={treatmentLog.dosage || "-"} />
      <DetailItem label="Tujuan / Gejala" value={treatmentLog.purpose || "-"} />
      <div className="md:col-span-2">
        <p className="text-muted-foreground text-xs">Catatan</p>
        <p className="mt-1 whitespace-pre-wrap font-medium">
          {treatmentLog.notes || "-"}
        </p>
      </div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  )
}
