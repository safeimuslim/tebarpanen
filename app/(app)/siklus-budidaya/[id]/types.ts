import type {
  ExpenseLog,
  FeedLog,
  HarvestLog,
  MortalityLog,
  SamplingLog,
  TreatmentLog,
  WaterQualityLog,
} from "@/app/generated/prisma/client"
import type { ActionState } from "@/app/lib/action-state"

export type FeedLogItem = Omit<FeedLog, "priceTotal"> & {
  priceTotal: number | null
}

export type FeedLogAction = (
  previousState: ActionState,
  formData: FormData
) => Promise<ActionState>

export type ExpenseLogItem = Omit<ExpenseLog, "amount"> & {
  amount: number
}

export type ExpenseLogAction = (
  previousState: ActionState,
  formData: FormData
) => Promise<ActionState>

export type HarvestLogItem = Omit<HarvestLog, "pricePerKg"> & {
  pricePerKg: number
}

export type HarvestLogAction = (
  previousState: ActionState,
  formData: FormData
) => Promise<ActionState>

export type MortalityLogItem = MortalityLog

export type MortalityLogAction = (
  previousState: ActionState,
  formData: FormData
) => Promise<ActionState>

export type SamplingLogItem = SamplingLog

export type SamplingLogAction = (
  previousState: ActionState,
  formData: FormData
) => Promise<ActionState>

export type WaterQualityLogItem = WaterQualityLog

export type WaterQualityLogAction = (
  previousState: ActionState,
  formData: FormData
) => Promise<ActionState>

export type TreatmentLogItem = TreatmentLog

export type TreatmentLogAction = (
  previousState: ActionState,
  formData: FormData
) => Promise<ActionState>
