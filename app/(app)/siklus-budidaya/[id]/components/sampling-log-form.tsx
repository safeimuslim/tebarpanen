import { ActionForm } from "@/components/action-form"
import { FormSubmitButton } from "@/components/form-submit-button"
import { buttonVariants } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import type { SamplingLogAction, SamplingLogItem } from "../types"
import { formatDateInput } from "../../utils"

export function SamplingLogForm({
  action,
  closeTargetId,
  cycleId,
  samplingLog,
  submitLabel,
}: {
  action: SamplingLogAction
  closeTargetId: string
  cycleId: string
  samplingLog?: SamplingLogItem
  submitLabel: string
}) {
  return (
    <ActionForm
      action={action}
      className="space-y-5 p-5"
      closeTargetId={closeTargetId}
      resetOnSuccess={!samplingLog}
    >
      <input name="cycleId" type="hidden" value={cycleId} />
      {samplingLog ? <input name="id" type="hidden" value={samplingLog.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          defaultValue={formatDateInput(samplingLog?.logDate)}
          label="Tanggal Sampling"
          name="logDate"
          type="date"
        />
        <FormField
          defaultValue={
            samplingLog?.sampleCount != null ? String(samplingLog.sampleCount) : undefined
          }
          label="Jumlah Sampel"
          name="sampleCount"
          type="number"
        />
        <FormField
          defaultValue={
            samplingLog?.averageWeightG != null
              ? String(samplingLog.averageWeightG)
              : undefined
          }
          label="Berat Rata-rata (gram)"
          name="averageWeightG"
          step="0.01"
          type="number"
        />
        <FormField
          defaultValue={
            samplingLog?.averageLengthCm != null
              ? String(samplingLog.averageLengthCm)
              : undefined
          }
          label="Panjang Rata-rata (cm)"
          name="averageLengthCm"
          step="0.01"
          type="number"
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium"
          htmlFor={samplingLog ? `sampling-notes-${samplingLog.id}` : "sampling-notes"}
        >
          Catatan Kondisi Ikan
        </label>
        <textarea
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={samplingLog?.notes ?? ""}
          id={samplingLog ? `sampling-notes-${samplingLog.id}` : "sampling-notes"}
          name="notes"
          placeholder="Catatan kondisi ikan saat sampling"
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
        className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
        defaultValue={defaultValue}
        id={name}
        name={name}
        step={step}
        type={type}
      />
    </div>
  )
}
