import { formatCurrency, formatDate, formatNumber } from "../../utils"
import type { HarvestLogItem } from "../types"

export function HarvestLogDetailContent({
  harvestLog,
}: {
  harvestLog: HarvestLogItem
}) {
  const revenue = harvestLog.totalWeightKg * harvestLog.pricePerKg

  return (
    <div className="grid gap-4 p-5 text-sm md:grid-cols-2">
      <DetailItem label="Tanggal Panen" value={formatDate(harvestLog.logDate)} />
      <DetailItem
        label="Total Berat Panen"
        value={`${formatNumber(harvestLog.totalWeightKg)} kg`}
      />
      <DetailItem
        label="Jumlah Ikan Terpanen"
        value={`${formatNumber(harvestLog.harvestedCount)} ekor`}
      />
      <DetailItem label="Harga Jual per kg" value={formatCurrency(harvestLog.pricePerKg)} />
      <DetailItem label="Estimasi Nilai Panen" value={formatCurrency(revenue)} />
      <DetailItem label="Pembeli" value={harvestLog.buyer || "-"} />
      <div className="md:col-span-2">
        <p className="text-muted-foreground text-xs">Catatan</p>
        <p className="mt-1 whitespace-pre-wrap font-medium">
          {harvestLog.notes || "-"}
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
