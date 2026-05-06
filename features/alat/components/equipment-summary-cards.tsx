import { SummaryCard } from "@/components/ui/summary-card"

import { formatCurrency } from "../utils"

export function EquipmentSummaryCards({
  needsCheckCount,
  readyCount,
  totalCount,
  totalPurchasePrice,
}: {
  needsCheckCount: number
  readyCount: number
  totalCount: number
  totalPurchasePrice: number
}) {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      <SummaryCard label="Total Alat" value={String(totalCount)} />
      <SummaryCard label="Siap Pakai" value={String(readyCount)} />
      <SummaryCard label="Perlu Cek" value={String(needsCheckCount)} />
      <SummaryCard
        label="Nilai Pembelian Alat"
        value={formatCurrency(totalPurchasePrice)}
      />
    </section>
  )
}
