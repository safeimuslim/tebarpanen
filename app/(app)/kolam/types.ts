import type { Pond } from "@/app/generated/prisma/client"
import type { PondShape, PondStatus, PondType } from "@/app/generated/prisma/enums"
import type { ActionState } from "@/app/lib/action-state"

export type PondFormData = Pond

export type PondFilters = {
  page: string
  query: string
  shape?: PondShape
  status?: PondStatus
  type?: PondType
}

export type PondPageData = {
  activeCount: number
  currentPage: number
  filters: PondFilters
  maintenanceCount: number
  ponds: PondFormData[]
  totalCount: number
  totalPages: number
  totalPurchasePrice: number
}

export type PondAction = (
  previousState: ActionState,
  formData: FormData
) => Promise<ActionState>
