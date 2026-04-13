import type {
  CultureCycle,
  ExpenseLog,
  Farm,
  FeedLog,
  MortalityLog,
  Pond,
  SamplingLog,
  TreatmentLog,
  WaterQualityLog,
} from "@/app/generated/prisma/client"
import type { CycleStatus } from "@/app/generated/prisma/enums"
import type { ActionState } from "@/app/lib/action-state"

export type CyclePondSummary = Pick<Pond, "id" | "name" | "type" | "shape" | "status">

export type SerializedCycle = Omit<CultureCycle, "seedPriceTotal"> & {
  seedPriceTotal: number | null
}

export type CycleWithRelations = SerializedCycle & {
  farm: Farm | null
  ponds: CyclePondSummary[]
  mortalityLogs: Array<{ deadCount: number }>
  feedLogs: Array<{ quantityKg: number }>
}

export type CycleFormPondOption = CyclePondSummary

export type CycleFormData = SerializedCycle & {
  ponds: CyclePondSummary[]
}

export type CycleDetailData = CultureCycle & {
  farm: Farm | null
  ponds: Array<{
    isActive: boolean
    pond: Pond
  }>
  expenseLogs: ExpenseLog[]
  mortalityLogs: MortalityLog[]
  feedLogs: FeedLog[]
  samplingLogs: SamplingLog[]
  treatmentLogs: TreatmentLog[]
  waterQualityLogs: WaterQualityLog[]
}

export type CyclePageData = {
  activeCount: number
  availablePonds: CycleFormPondOption[]
  canManageCycles: boolean
  cycles: CycleWithRelations[]
  totalEstimatedAlive: number
  totalPondsUsed: number
}

export type CycleAction = (
  previousState: ActionState,
  formData: FormData
) => Promise<ActionState>

export type CycleStatusOption = {
  value: CycleStatus
  label: string
}
