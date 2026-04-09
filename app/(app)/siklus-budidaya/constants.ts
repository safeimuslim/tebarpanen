import type { CycleStatus } from "@/app/generated/prisma/enums"

export const cycleStatusLabels: Record<CycleStatus, string> = {
  ACTIVE: "Aktif",
  HARVESTED: "Panen",
  FAILED: "Gagal",
  CLOSED: "Selesai",
}

export const ACTIVE_CYCLE_STATUS: CycleStatus = "ACTIVE"
