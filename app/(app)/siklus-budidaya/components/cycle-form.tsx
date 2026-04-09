import { DialogClose } from "@/components/ui/dialog"
import { ActionForm } from "@/components/action-form"
import { FormSubmitButton } from "@/components/form-submit-button"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { cycleStatusLabels } from "../constants"
import type {
  CycleAction,
  CycleFormData,
  CycleFormPondOption,
} from "../types"
import { formatDateInput, formatDecimalInput } from "../utils"

export function CycleForm({
  action,
  availablePonds,
  canEditStatus = false,
  closeTargetId,
  cycle,
  submitLabel,
}: {
  action: CycleAction
  availablePonds: CycleFormPondOption[]
  canEditStatus?: boolean
  closeTargetId: string
  cycle?: CycleFormData
  submitLabel: string
}) {
  const pondOptions = cycle?.ponds
    ? ensureCurrentPondsIncluded(availablePonds, cycle.ponds)
    : availablePonds
  const selectedPondIds = new Set(cycle?.ponds.map((pond) => pond.id) ?? [])

  return (
    <ActionForm
      action={action}
      className="space-y-5 p-5"
      closeTargetId={closeTargetId}
      resetOnSuccess={!cycle}
    >
      {cycle ? <input name="id" type="hidden" value={cycle.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          defaultValue={cycle?.cycleName}
          label="Nama Siklus"
          name="cycleName"
        />
        <FormField
          defaultValue={formatDateInput(cycle?.startDate)}
          label="Tanggal Mulai"
          name="startDate"
          type="date"
        />
        <FormField
          defaultValue={cycle ? String(cycle.seedCount) : undefined}
          label="Jumlah Bibit"
          name="seedCount"
          type="number"
        />
        <FormField
          defaultValue={
            cycle?.initialAvgWeightG != null
              ? String(cycle.initialAvgWeightG)
              : undefined
          }
          label="Berat Rata-rata Awal (gram)"
          name="initialAvgWeightG"
          step="0.01"
          type="number"
        />
        <FormField
          defaultValue={formatDecimalInput(cycle?.seedPriceTotal)}
          label="Harga Bibit (Rp)"
          name="seedPriceTotal"
          step="0.01"
          type="number"
        />
        <FormField
          defaultValue={formatDateInput(cycle?.targetHarvestDate)}
          label="Target Panen"
          name="targetHarvestDate"
          type="date"
        />
        {canEditStatus ? (
          <SelectField
            defaultValue={cycle?.status}
            label="Status"
            name="status"
            options={Object.entries(cycleStatusLabels).map(([value, label]) => ({
              label,
              value,
            }))}
          />
        ) : null}

        <PondSelectionField
          ponds={pondOptions}
          selectedPondIds={selectedPondIds}
        />
      </div>

      {pondOptions.length === 0 ? (
        <p className="bg-muted text-muted-foreground rounded-md px-3 py-2 text-sm">
          Belum ada kolam tersedia. Kolam yang sedang dipakai pada siklus aktif tidak
          dapat dipilih.
        </p>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={cycle ? `notes-${cycle.id}` : "notes"}>
          Catatan
        </label>
        <textarea
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={cycle?.notes ?? ""}
          id={cycle ? `notes-${cycle.id}` : "notes"}
          name="notes"
          placeholder="Catatan siklus"
        />
      </div>

      <div className="border-border flex justify-end gap-2 border-t pt-4">
        <DialogClose
          id={closeTargetId}
          render={
            <button
              className={cn(buttonVariants({ variant: "outline" }))}
              type="button"
            />
          }
        >
          Batal
        </DialogClose>
        <FormSubmitButton
          disabled={pondOptions.length === 0}
          pendingLabel="Menyimpan..."
          type="submit"
        >
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

function SelectField({
  defaultValue,
  disabled = false,
  label,
  name,
  options,
  placeholder,
}: {
  defaultValue?: string
  disabled?: boolean
  label: string
  name: string
  options: Array<{ label: string; value: string }>
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <select
        className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
        defaultValue={defaultValue}
        disabled={disabled}
        id={name}
        name={name}
      >
        <option value="">{placeholder ?? "Pilih salah satu"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function PondSelectionField({
  ponds,
  selectedPondIds,
}: {
  ponds: CycleFormPondOption[]
  selectedPondIds: Set<string>
}) {
  return (
    <fieldset className="space-y-3 md:col-span-2">
      <div>
        <legend className="text-sm font-medium">Kolam Dalam Siklus</legend>
        <p className="text-muted-foreground mt-1 text-sm">
          Pilih satu atau beberapa kolam. Kolam yang sedang dipakai pada siklus aktif lain
          tidak akan muncul di daftar.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {ponds.map((pond) => (
          <label
            className="border-border bg-background flex items-start gap-3 rounded-lg border p-3"
            key={pond.id}
          >
            <input
              className="mt-1 size-4"
              defaultChecked={selectedPondIds.has(pond.id)}
              name="pondIds"
              type="checkbox"
              value={pond.id}
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium">{pond.name}</span>
              <span className="text-muted-foreground mt-1 block text-xs">
                {pond.type.toLowerCase()} • {pond.shape.toLowerCase()} •{" "}
                {pond.status.toLowerCase()}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function ensureCurrentPondsIncluded(
  ponds: CycleFormPondOption[],
  currentPonds: CycleFormData["ponds"]
) {
  const merged = [...currentPonds, ...ponds]
  return merged.filter(
    (pond, index) => merged.findIndex((item) => item.id === pond.id) === index
  )
}
