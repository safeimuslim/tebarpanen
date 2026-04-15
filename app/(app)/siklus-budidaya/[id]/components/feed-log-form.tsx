import { ActionForm } from "@/components/action-form"
import { FormSubmitButton } from "@/components/form-submit-button"
import { buttonVariants } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import type { FeedLogAction, FeedLogItem } from "../types"
import { formatDateInput, formatDecimalInput } from "../../utils"

export function FeedLogForm({
  action,
  closeTargetId,
  cycleId,
  feedLog,
  submitLabel,
}: {
  action: FeedLogAction
  closeTargetId: string
  cycleId: string
  feedLog?: FeedLogItem
  submitLabel: string
}) {
  return (
    <ActionForm
      action={action}
      className="space-y-5 p-5"
      closeTargetId={closeTargetId}
      resetOnSuccess={!feedLog}
    >
      <input name="cycleId" type="hidden" value={cycleId} />
      {feedLog ? <input name="id" type="hidden" value={feedLog.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          defaultValue={formatDateInput(feedLog?.logDate)}
          label="Tanggal"
          name="logDate"
          type="date"
        />
        <FormField
          defaultValue={feedLog?.feedName}
          label="Jenis Pakan"
          name="feedName"
        />
        <FormField
          defaultValue={
            feedLog?.quantityKg != null ? String(feedLog.quantityKg) : undefined
          }
          label="Berat Pakan (kg)"
          name="quantityKg"
          step="0.01"
          type="number"
        />
        <FormField
          defaultValue={formatDecimalInput(feedLog?.priceTotal)}
          label="Harga Pakan (Rp)"
          name="priceTotal"
          step="0.01"
          type="number"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={feedLog ? `feed-notes-${feedLog.id}` : "feed-notes"}>
          Catatan
        </label>
        <textarea
          className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={feedLog?.notes ?? ""}
          id={feedLog ? `feed-notes-${feedLog.id}` : "feed-notes"}
          name="notes"
          placeholder="Catatan pakan"
        />
      </div>

      <div className="border-border flex justify-end gap-2 border-t pt-4">
        <DialogClose
          id={closeTargetId}
          render={<button className={cn(buttonVariants({ variant: "outline" }))} type="button" />}
        >
          Batal
        </DialogClose>
        <FormSubmitButton pendingLabel="Menyimpan..." type="submit">
          {submitLabel}
        </FormSubmitButton>
      </div>
    </ActionForm>
  )
}

function FormField({
  defaultValue,
  label,
  name,
  step,
  type = "text",
}: {
  defaultValue?: string
  label: string
  name: string
  step?: string
  type?: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <input
        className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
        defaultValue={defaultValue}
        id={name}
        name={name}
        step={step}
        type={type}
      />
    </div>
  )
}
