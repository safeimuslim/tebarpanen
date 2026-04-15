import { ActionForm } from "@/components/action-form"
import { FormSubmitButton } from "@/components/form-submit-button"
import { buttonVariants } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { formatDateInput, formatDecimalInput } from "../../utils"
import type { HarvestLogAction, HarvestLogItem } from "../types"

export function HarvestLogForm({
  action,
  closeTargetId,
  cycleId,
  harvestLog,
  submitLabel,
}: {
  action: HarvestLogAction
  closeTargetId: string
  cycleId: string
  harvestLog?: HarvestLogItem
  submitLabel: string
}) {
  return (
    <ActionForm
      action={action}
      className="space-y-5 p-5"
      closeTargetId={closeTargetId}
      resetOnSuccess={!harvestLog}
    >
      <input name="cycleId" type="hidden" value={cycleId} />
      {harvestLog ? <input name="id" type="hidden" value={harvestLog.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          defaultValue={formatDateInput(harvestLog?.logDate)}
          label="Tanggal Panen"
          name="logDate"
          type="date"
        />
        <FormField
          defaultValue={
            harvestLog?.totalWeightKg != null ? String(harvestLog.totalWeightKg) : undefined
          }
          label="Total Berat Panen (kg)"
          name="totalWeightKg"
          step="0.01"
          type="number"
        />
        <FormField
          defaultValue={
            harvestLog?.harvestedCount != null ? String(harvestLog.harvestedCount) : undefined
          }
          label="Jumlah Ikan Terpanen"
          name="harvestedCount"
          type="number"
        />
        <FormField
          defaultValue={formatDecimalInput(harvestLog?.pricePerKg)}
          label="Harga Jual per kg (Rp)"
          name="pricePerKg"
          step="0.01"
          type="number"
        />
        <FormField
          defaultValue={harvestLog?.buyer ?? ""}
          label="Pembeli"
          name="buyer"
          placeholder="Nama pembeli"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={harvestLog ? `harvest-notes-${harvestLog.id}` : "harvest-notes"}>
          Catatan
        </label>
        <textarea
          className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={harvestLog?.notes ?? ""}
          id={harvestLog ? `harvest-notes-${harvestLog.id}` : "harvest-notes"}
          name="notes"
          placeholder="Catatan panen"
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
  placeholder,
  step,
  type = "text",
}: {
  defaultValue?: string
  label: string
  name: string
  placeholder?: string
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
        placeholder={placeholder}
        step={step}
        type={type}
      />
    </div>
  )
}
