import { expenseCategoryLabels } from "../../constants"
import { formatCurrency, formatDate } from "../../utils"
import type { ExpenseLogItem } from "../types"

export function ExpenseLogDetailContent({
  expenseLog,
}: {
  expenseLog: ExpenseLogItem
}) {
  return (
    <div className="grid gap-4 p-5 text-sm md:grid-cols-2">
      <DetailItem label="Tanggal" value={formatDate(expenseLog.logDate)} />
      <DetailItem
        label="Kategori"
        value={expenseCategoryLabels[expenseLog.category]}
      />
      <DetailItem label="Nama Biaya" value={expenseLog.title} />
      <DetailItem label="Nominal" value={formatCurrency(expenseLog.amount)} />
      <DetailItem label="Dibuat" value={formatDate(expenseLog.createdAt)} />
      <DetailItem label="Diperbarui" value={formatDate(expenseLog.updatedAt)} />
      <div className="md:col-span-2">
        <p className="text-muted-foreground text-xs">Catatan</p>
        <p className="mt-1 whitespace-pre-wrap font-medium">
          {expenseLog.notes || "-"}
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
