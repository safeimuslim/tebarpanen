import { HarvestPaymentStatus } from "@/app/generated/prisma/enums"

import type { HarvestTransactionListItem } from "../queries"

export function getPaymentStatusMeta(transaction: HarvestTransactionListItem) {
  if (transaction.paymentStatus === HarvestPaymentStatus.PAID) {
    return {
      className: "bg-primary/12 text-primary",
      label: "Lunas",
    }
  }

  if (transaction.paymentStatus === HarvestPaymentStatus.PARTIALLY_PAID) {
    return {
      className: "bg-[#E5A93D]/15 text-[#A87412]",
      label: "DP",
    }
  }

  if (transaction.dueDate && transaction.dueDate >= startOfDay(new Date())) {
    return {
      className: "bg-[#125E8A]/12 text-[#125E8A]",
      label: "Belum jatuh tempo",
    }
  }

  return {
    className: "bg-destructive/10 text-destructive",
    label: "Belum lunas",
  }
}

function startOfDay(value: Date) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}
