import type { FeedLog } from "@/app/generated/prisma/client"
import type { ActionState } from "@/app/lib/action-state"

export type FeedLogItem = Omit<FeedLog, "priceTotal"> & {
  priceTotal: number | null
}

export type FeedLogAction = (
  previousState: ActionState,
  formData: FormData
) => Promise<ActionState>
