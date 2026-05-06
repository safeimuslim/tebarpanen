import { SummaryCard } from "@/components/ui/summary-card"

import { formatCurrency } from "../utils"

export function PondSummaryCards({
  activeCount,
  maintenanceCount,
  totalCount,
  totalPurchasePrice,
}: {
  activeCount: number
  maintenanceCount: number
  totalCount: number
  totalPurchasePrice: number
}) {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      <SummaryCard label="Total Kolam" value={String(totalCount)} />
      <SummaryCard label="Aktif" value={String(activeCount)} />
      <SummaryCard label="Perawatan" value={String(maintenanceCount)} />
      <SummaryCard
        label="Nilai Pembelian Kolam"
        value={formatCurrency(totalPurchasePrice)}
      />
    </section>
  )
}
