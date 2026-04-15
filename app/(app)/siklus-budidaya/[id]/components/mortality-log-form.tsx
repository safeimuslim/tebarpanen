import { ActionForm } from "@/components/action-form"
import { FormSubmitButton } from "@/components/form-submit-button"
import { buttonVariants } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import type { MortalityLogAction, MortalityLogItem } from "../types"
import { formatDateInput } from "../../utils"

export function MortalityLogForm({
  action,
  closeTargetId,
  cycleId,
  mortalityLog,
  submitLabel,
}: {
  action: MortalityLogAction
  closeTargetId: string
  cycleId: string
  mortalityLog?: MortalityLogItem
  submitLabel: string
}) {
  return (
    <ActionForm
      action={action}
      className="space-y-5 p-5"
      closeTargetId={closeTargetId}
      resetOnSuccess={!mortalityLog}
    >
      <input name="cycleId" type="hidden" value={cycleId} />
      {mortalityLog ? <input name="id" type="hidden" value={mortalityLog.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          defaultValue={formatDateInput(mortalityLog?.logDate)}
          label="Tanggal"
          name="logDate"
          type="date"
        />
        <FormField
          defaultValue={
            mortalityLog?.deadCount != null ? String(mortalityLog.deadCount) : undefined
          }
          label="Jumlah Ikan Mati"
          name="deadCount"
          type="number"
        />
        <FormField
          defaultValue={mortalityLog?.cause ?? ""}
          label="Penyebab / Gejala"
          name="cause"
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium"
          htmlFor={mortalityLog ? `mortality-notes-${mortalityLog.id}` : "mortality-notes"}
        >
          Catatan
        </label>
        <textarea
          className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={mortalityLog?.notes ?? ""}
          id={mortalityLog ? `mortality-notes-${mortalityLog.id}` : "mortality-notes"}
          name="notes"
          placeholder="Catatan mortalitas"
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
  type = "text",
}: {
  defaultValue?: string
  label: string
  name: string
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
        type={type}
      />
    </div>
  )
}
