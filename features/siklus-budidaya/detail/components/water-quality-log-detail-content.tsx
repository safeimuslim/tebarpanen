import type { WaterQualityLogItem } from "../types"
import { formatDate, formatNumber } from "../../utils"

export function WaterQualityLogDetailContent({
  waterQualityLog,
}: {
  waterQualityLog: WaterQualityLogItem
}) {
  return (
    <div className="grid gap-4 p-5 text-sm md:grid-cols-2">
      <DetailItem label="Tanggal" value={formatDate(waterQualityLog.logDate)} />
      <DetailItem label="pH" value={formatMetric(waterQualityLog.ph)} />
      <DetailItem
        label="Suhu"
        value={waterQualityLog.temperatureC != null ? `${formatNumber(waterQualityLog.temperatureC)} °C` : "-"}
      />
      <DetailItem
        label="DO"
        value={waterQualityLog.doMgL != null ? `${formatNumber(waterQualityLog.doMgL)} mg/L` : "-"}
      />
      <DetailItem
        label="Amonia"
        value={waterQualityLog.ammoniaMgL != null ? `${formatNumber(waterQualityLog.ammoniaMgL)} mg/L` : "-"}
      />
      <DetailItem label="Warna Air" value={waterQualityLog.waterColor || "-"} />
      <div className="md:col-span-2">
        <p className="text-muted-foreground text-xs">Catatan</p>
        <p className="mt-1 whitespace-pre-wrap font-medium">
          {waterQualityLog.notes || "-"}
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

function formatMetric(value?: number | null) {
  return value != null ? formatNumber(value) : "-"
}
