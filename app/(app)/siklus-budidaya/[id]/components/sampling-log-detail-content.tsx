import type { SamplingLogItem } from "../types"
import { formatDate, formatNumber } from "../../utils"

export function SamplingLogDetailContent({
  samplingLog,
}: {
  samplingLog: SamplingLogItem
}) {
  return (
    <div className="grid gap-4 p-5 text-sm md:grid-cols-2">
      <DetailItem label="Tanggal Sampling" value={formatDate(samplingLog.logDate)} />
      <DetailItem label="Jumlah Sampel" value={`${formatNumber(samplingLog.sampleCount)} ekor`} />
      <DetailItem
        label="Berat Rata-rata"
        value={`${formatNumber(samplingLog.averageWeightG)} g`}
      />
      <DetailItem
        label="Panjang Rata-rata"
        value={`${formatNumber(samplingLog.averageLengthCm)} cm`}
      />
      <div className="md:col-span-2">
        <p className="text-muted-foreground text-xs">Catatan Kondisi Ikan</p>
        <p className="mt-1 whitespace-pre-wrap font-medium">
          {samplingLog.notes || "-"}
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
