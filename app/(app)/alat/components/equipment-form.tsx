import { ClipboardCheck } from "lucide-react"

import { ActionForm } from "@/components/action-form"
import { FormSubmitButton } from "@/components/form-submit-button"
import { buttonVariants } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import {
  equipmentConditionLabels,
  equipmentTypeLabels,
} from "../constants"
import type { EquipmentAction, EquipmentFormData } from "../types"
import {
  formatDateInput,
  formatDecimalInput,
  formatNumberInput,
} from "../utils"

export function EquipmentForm({
  action,
  closeTargetId,
  equipment,
  submitLabel,
}: {
  action: EquipmentAction
  closeTargetId: string
  equipment?: EquipmentFormData
  submitLabel: string
}) {
  return (
    <ActionForm
      action={action}
      className="space-y-5 p-5"
      closeTargetId={closeTargetId}
      resetOnSuccess={!equipment}
    >
      {equipment ? <input name="id" type="hidden" value={equipment.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          defaultValue={equipment?.name}
          label="Nama Alat"
          name="name"
        />
        <SelectField
          defaultValue={equipment?.type}
          label="Jenis Alat"
          name="type"
          options={equipmentTypeLabels}
        />
        <FormField
          defaultValue={formatNumberInput(equipment?.quantity)}
          label="Jumlah"
          name="quantity"
          type="number"
        />
        <FormField
          defaultValue={equipment?.brand ?? ""}
          label="Merek"
          name="brand"
        />
        <FormField
          defaultValue={equipment?.serialNumber ?? ""}
          label="Nomor Seri"
          name="serialNumber"
        />
        <FormField
          defaultValue={formatDateInput(equipment?.calibrationDate)}
          label="Tanggal Kalibrasi"
          name="calibrationDate"
          type="date"
        />
        <SelectField
          defaultValue={equipment?.condition}
          label="Kondisi"
          name="condition"
          options={equipmentConditionLabels}
        />
        <FormField
          defaultValue={formatDecimalInput(equipment?.purchasePrice)}
          label="Harga Pembelian (Rp)"
          name="purchasePrice"
          step="0.01"
          type="number"
        />
        <FormField
          defaultValue={formatDateInput(equipment?.purchasedAt)}
          label="Tanggal Pembelian"
          name="purchasedAt"
          type="date"
        />
        <FormField
          defaultValue={formatNumberInput(equipment?.depreciationMonths)}
          label="Masa Penyusutan (bulan)"
          name="depreciationMonths"
          type="number"
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium"
          htmlFor={equipment ? `notes-${equipment.id}` : "notes"}
        >
          Catatan
        </label>
        <textarea
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={equipment?.notes ?? ""}
          id={equipment ? `notes-${equipment.id}` : "notes"}
          name="notes"
          placeholder="Catatan alat"
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
        <FormSubmitButton className="gap-2" pendingLabel="Menyimpan..." type="submit">
          <ClipboardCheck className="size-4" />
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
        className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
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

function SelectField<TValue extends string>({
  defaultValue,
  label,
  name,
  options,
}: {
  defaultValue?: TValue
  label: string
  name: string
  options: Record<TValue, string>
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <select
        className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
        defaultValue={defaultValue}
        id={name}
        name={name}
      >
        {Object.entries(options).map(([value, optionLabel]) => (
          <option key={value} value={value}>
            {optionLabel as string}
          </option>
        ))}
      </select>
    </div>
  )
}
