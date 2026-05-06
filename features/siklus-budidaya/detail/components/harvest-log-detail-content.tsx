import { formatCurrency, formatDate, formatNumber } from "../../utils"
import type { HarvestTransactionItem } from "../types"
import { HarvestPaymentStatus } from "@/app/generated/prisma/enums"

export function HarvestTransactionDetailContent({
  transaction,
}: {
  transaction: HarvestTransactionItem
}) {
  return (
    <div className="grid gap-4 p-5 text-sm md:grid-cols-2">
      <DetailItem label="Invoice" value={transaction.invoiceNumber} />
      <DetailItem label="Tanggal Panen" value={formatDate(transaction.harvestDate)} />
      <DetailItem
        label="Total Berat Panen"
        value={`${formatNumber(transaction.totalWeightKg)} kg`}
      />
      <DetailItem
        label="Jumlah Ikan Terpanen"
        value={`${formatNumber(transaction.harvestedCount)} ekor`}
      />
      <DetailItem label="Harga Jual per kg" value={formatCurrency(transaction.pricePerKg)} />
      <DetailItem label="Nilai Transaksi" value={formatCurrency(transaction.grossAmount)} />
      <DetailItem label="Pembeli" value={transaction.buyerName} />
      <DetailItem
        label="Status Pembayaran"
        value={getPaymentStatusLabel(transaction.paymentStatus)}
      />
      <DetailItem label="Jatuh Tempo" value={formatDate(transaction.dueDate)} />
      <div className="md:col-span-2">
        <p className="text-muted-foreground text-xs">Catatan</p>
        <p className="mt-1 whitespace-pre-wrap font-medium">
          {transaction.notes || "-"}
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

function getPaymentStatusLabel(status: HarvestPaymentStatus) {
  if (status === HarvestPaymentStatus.PAID) {
    return "Lunas"
  }

  if (status === HarvestPaymentStatus.PARTIALLY_PAID) {
    return "DP / Sebagian"
  }

  return "Belum Lunas"
}
