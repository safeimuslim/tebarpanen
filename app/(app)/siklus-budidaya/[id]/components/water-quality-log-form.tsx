import { ActionForm } from "@/components/action-form"
import { FormSubmitButton } from "@/components/form-submit-button"
import { buttonVariants } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import type { WaterQualityLogAction, WaterQualityLogItem } from "../types"
import { formatDateInput } from "../../utils"

export function WaterQualityLogForm({
  action,
  closeTargetId,
  cycleId,
  waterQualityLog,
  submitLabel,
}: {
  action: WaterQualityLogAction
  closeTargetId: string
  cycleId: string
  waterQualityLog?: WaterQualityLogItem
  submitLabel: string
}) {
  return (
    <ActionForm
      action={action}
      className="space-y-5 p-5"
      closeTargetId={closeTargetId}
      resetOnSuccess={!waterQualityLog}
    >
      <input name="cycleId" type="hidden" value={cycleId} />
      {waterQualityLog ? <input name="id" type="hidden" value={waterQualityLog.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          defaultValue={formatDateInput(waterQualityLog?.logDate)}
          label="Tanggal"
          name="logDate"
          type="date"
        />
        <FormField
          defaultValue={waterQualityLog?.ph != null ? String(waterQualityLog.ph) : undefined}
          label="pH"
          name="ph"
          step="0.01"
          type="number"
        />
        <FormField
          defaultValue={
            waterQualityLog?.temperatureC != null ? String(waterQualityLog.temperatureC) : undefined
          }
          label="Suhu (°C)"
          name="temperatureC"
          step="0.01"
          type="number"
        />
        <FormField
          defaultValue={
            waterQualityLog?.doMgL != null ? String(waterQualityLog.doMgL) : undefined
          }
          label="DO (mg/L)"
          name="doMgL"
          step="0.01"
          type="number"
        />
        <FormField
          defaultValue={
            waterQualityLog?.ammoniaMgL != null ? String(waterQualityLog.ammoniaMgL) : undefined
          }
          label="Amonia (mg/L)"
          name="ammoniaMgL"
          step="0.01"
          type="number"
        />
        <FormField
          defaultValue={waterQualityLog?.waterColor ?? ""}
          label="Warna Air"
          name="waterColor"
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium"
          htmlFor={waterQualityLog ? `water-quality-notes-${waterQualityLog.id}` : "water-quality-notes"}
        >
          Catatan
        </label>
        <textarea
          className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={waterQualityLog?.notes ?? ""}
          id={waterQualityLog ? `water-quality-notes-${waterQualityLog.id}` : "water-quality-notes"}
          name="notes"
          placeholder="Catatan kualitas air"
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
