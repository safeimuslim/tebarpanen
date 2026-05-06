import type { MortalityLogItem } from "../types"
import { formatDate, formatNumber } from "../../utils"

export function MortalityLogDetailContent({
  mortalityLog,
}: {
  mortalityLog: MortalityLogItem
}) {
  return (
    <div className="grid gap-4 p-5 text-sm md:grid-cols-2">
      <DetailItem label="Tanggal" value={formatDate(mortalityLog.logDate)} />
      <DetailItem
        label="Jumlah Ikan Mati"
        value={`${formatNumber(mortalityLog.deadCount)} ekor`}
      />
      <DetailItem
        label="Penyebab / Gejala"
        value={mortalityLog.cause || "-"}
      />
      <div className="md:col-span-2">
        <p className="text-muted-foreground text-xs">Catatan</p>
        <p className="mt-1 whitespace-pre-wrap font-medium">
          {mortalityLog.notes || "-"}
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
