import { formatNumber } from "../utils"

export function CycleSummaryCards({
  activeCount,
  totalEstimatedAlive,
  totalPondsUsed,
}: {
  activeCount: number
  totalEstimatedAlive: number
  totalPondsUsed: number
}) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <SummaryCard label="Siklus Aktif" value={formatNumber(activeCount)} />
      <SummaryCard label="Kolam Digunakan" value={formatNumber(totalPondsUsed)} />
      <SummaryCard
        label="Estimasi Ikan Hidup"
        value={formatNumber(totalEstimatedAlive)}
      />
    </section>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="border-border bg-card rounded-lg border p-4 shadow-sm">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </article>
  )
}
