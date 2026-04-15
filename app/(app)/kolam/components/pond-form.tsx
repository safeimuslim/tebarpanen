import { DialogClose } from "@/components/ui/dialog"
import { ActionForm } from "@/components/action-form"
import { FormSubmitButton } from "@/components/form-submit-button"
import { PondShapeDimensionFields } from "@/components/pond-shape-dimension-fields"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { pondShapeLabels, pondStatusLabels, pondTypeLabels } from "../constants"
import type { PondAction, PondFormData } from "../types"
import {
  formatDateInput,
  formatDecimalInput,
  formatNumberInput,
} from "../utils"

export function PondForm({
  action,
  closeTargetId,
  pond,
  submitLabel,
}: {
  action: PondAction
  closeTargetId: string
  pond?: PondFormData
  submitLabel: string
}) {
  return (
    <ActionForm
      action={action}
      className="space-y-5 p-5"
      closeTargetId={closeTargetId}
      resetOnSuccess={!pond}
    >
      {pond ? <input name="id" type="hidden" value={pond.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <FormField defaultValue={pond?.name} label="Nama Kolam" name="name" />
        <SelectField
          defaultValue={pond?.type}
          label="Jenis Kolam"
          name="type"
          options={pondTypeLabels}
        />
        <SelectField
          defaultValue={pond?.status}
          label="Status"
          name="status"
          options={pondStatusLabels}
        />
        <PondShapeDimensionFields
          defaultDepthM={formatNumberInput(pond?.depthM)}
          defaultDiameterM={formatNumberInput(pond?.diameterM)}
          defaultLengthM={formatNumberInput(pond?.lengthM)}
          defaultShape={pond?.shape}
          defaultWidthM={formatNumberInput(pond?.widthM)}
          shapeOptions={pondShapeLabels}
        />
        <FormField
          defaultValue={formatNumberInput(pond?.capacity)}
          label="Kapasitas"
          name="capacity"
          type="number"
        />
        <FormField
          defaultValue={formatDecimalInput(pond?.purchasePrice)}
          label="Harga Pembelian (Rp)"
          name="purchasePrice"
          step="0.01"
          type="number"
        />
        <FormField
          defaultValue={formatDateInput(pond?.installedAt)}
          label="Tanggal Pasang"
          name="installedAt"
          type="date"
        />
        <FormField
          defaultValue={formatNumberInput(pond?.depreciationMonths)}
          label="Masa Penyusutan (bulan)"
          name="depreciationMonths"
          type="number"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={pond ? `notes-${pond.id}` : "notes"}>
          Catatan
        </label>
        <textarea
          className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={pond?.notes ?? ""}
          id={pond ? `notes-${pond.id}` : "notes"}
          name="notes"
          placeholder="Catatan kolam"
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
        className="border-input bg-white text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
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
