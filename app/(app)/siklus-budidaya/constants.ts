import type { CycleStatus, ExpenseCategory } from "@/app/generated/prisma/enums"

export const cycleStatusLabels: Record<CycleStatus, string> = {
  ACTIVE: "Aktif",
  HARVESTED: "Panen",
  FAILED: "Gagal",
  CLOSED: "Selesai",
}

export const ACTIVE_CYCLE_STATUS: CycleStatus = "ACTIVE"

export const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  SEED: "Bibit",
  FEED: "Pakan",
  MEDICINE_VITAMIN: "Obat / Vitamin",
  LABOR: "Tenaga Kerja",
  ELECTRICITY: "Listrik",
  OTHER: "Lain-lain",
}
