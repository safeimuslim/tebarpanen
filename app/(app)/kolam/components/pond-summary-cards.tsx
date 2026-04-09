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

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border bg-card rounded-lg border p-4 shadow-sm">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  )
}
