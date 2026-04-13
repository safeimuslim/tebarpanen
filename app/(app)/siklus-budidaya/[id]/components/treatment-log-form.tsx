import { ActionForm } from "@/components/action-form"
import { FormSubmitButton } from "@/components/form-submit-button"
import { buttonVariants } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import type { TreatmentLogAction, TreatmentLogItem } from "../types"
import { formatDateInput } from "../../utils"

export function TreatmentLogForm({
  action,
  closeTargetId,
  cycleId,
  submitLabel,
  treatmentLog,
}: {
  action: TreatmentLogAction
  closeTargetId: string
  cycleId: string
  submitLabel: string
  treatmentLog?: TreatmentLogItem
}) {
  return (
    <ActionForm
      action={action}
      className="space-y-5 p-5"
      closeTargetId={closeTargetId}
      resetOnSuccess={!treatmentLog}
    >
      <input name="cycleId" type="hidden" value={cycleId} />
      {treatmentLog ? <input name="id" type="hidden" value={treatmentLog.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          defaultValue={formatDateInput(treatmentLog?.logDate)}
          label="Tanggal"
          name="logDate"
          type="date"
        />
        <FormField
          defaultValue={treatmentLog?.productName}
          label="Nama Obat / Vitamin"
          name="productName"
        />
        <FormField
          defaultValue={treatmentLog?.dosage ?? ""}
          label="Dosis"
          name="dosage"
        />
        <FormField
          defaultValue={treatmentLog?.purpose ?? ""}
          label="Tujuan / Gejala"
          name="purpose"
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium"
          htmlFor={treatmentLog ? `treatment-notes-${treatmentLog.id}` : "treatment-notes"}
        >
          Catatan
        </label>
        <textarea
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={treatmentLog?.notes ?? ""}
          id={treatmentLog ? `treatment-notes-${treatmentLog.id}` : "treatment-notes"}
          name="notes"
          placeholder="Catatan pengobatan"
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
        className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
        defaultValue={defaultValue}
        id={name}
        name={name}
        type={type}
      />
    </div>
  )
}
