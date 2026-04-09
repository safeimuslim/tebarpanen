import type { Equipment } from "@/app/generated/prisma/client"
import type { EquipmentCondition, EquipmentType } from "@/app/generated/prisma/enums"
import type { ActionState } from "@/app/lib/action-state"

export type EquipmentFormData = Equipment

export type EquipmentFilters = {
  condition?: EquipmentCondition
  page: string
  query: string
  type?: EquipmentType
}

export type EquipmentPageData = {
  currentPage: number
  equipment: EquipmentFormData[]
  filters: EquipmentFilters
  needsCheckCount: number
  readyCount: number
  totalCount: number
  totalPages: number
  totalPurchasePrice: number
}

export type EquipmentAction = (
  previousState: ActionState,
  formData: FormData
) => Promise<ActionState>
