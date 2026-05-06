import type { FeedLogItem } from "../types"
import { formatCurrency, formatDate, formatNumber } from "../../utils"

export function FeedLogDetailContent({ feedLog }: { feedLog: FeedLogItem }) {
  return (
    <div className="grid gap-4 p-5 text-sm md:grid-cols-2">
      <DetailItem label="Tanggal" value={formatDate(feedLog.logDate)} />
      <DetailItem label="Jenis Pakan" value={feedLog.feedName} />
      <DetailItem
        label="Berat Pakan"
        value={`${formatNumber(feedLog.quantityKg)} kg`}
      />
      <DetailItem
        label="Harga Pakan"
        value={formatCurrency(feedLog.priceTotal)}
      />
      <div className="md:col-span-2">
        <p className="text-muted-foreground text-xs">Catatan</p>
        <p className="mt-1 whitespace-pre-wrap font-medium">
          {feedLog.notes || "-"}
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
