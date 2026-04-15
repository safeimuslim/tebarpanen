import { ExpenseCategory } from "@/app/generated/prisma/enums"
import { ActionForm } from "@/components/action-form"
import { FormSubmitButton } from "@/components/form-submit-button"
import { buttonVariants } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { expenseCategoryLabels } from "../../constants"
import { formatDateInput, formatDecimalInput } from "../../utils"
import type { ExpenseLogAction, ExpenseLogItem } from "../types"

export function ExpenseLogForm({
  action,
  closeTargetId,
  cycleId,
  expenseLog,
  submitLabel,
}: {
  action: ExpenseLogAction
  closeTargetId: string
  cycleId: string
  expenseLog?: ExpenseLogItem
  submitLabel: string
}) {
  return (
    <ActionForm
      action={action}
      className="space-y-5 p-5"
      closeTargetId={closeTargetId}
      resetOnSuccess={!expenseLog}
    >
      <input name="cycleId" type="hidden" value={cycleId} />
      {expenseLog ? <input name="id" type="hidden" value={expenseLog.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          defaultValue={formatDateInput(expenseLog?.logDate)}
          label="Tanggal"
          name="logDate"
          type="date"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor={expenseLog ? `expense-category-${expenseLog.id}` : "expense-category"}>
            Kategori Biaya
          </label>
          <select
            className="border-input bg-white text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
            defaultValue={expenseLog?.category ?? ""}
            id={expenseLog ? `expense-category-${expenseLog.id}` : "expense-category"}
            name="category"
          >
            <option value="">Pilih kategori</option>
            {Object.values(ExpenseCategory).map((category) => (
              <option key={category} value={category}>
                {expenseCategoryLabels[category]}
              </option>
            ))}
          </select>
        </div>

        <FormField
          defaultValue={expenseLog?.title}
          label="Nama Biaya"
          name="title"
          placeholder="Contoh: Gaji teknisi mingguan"
        />
        <FormField
          defaultValue={formatDecimalInput(expenseLog?.amount)}
          label="Nominal (Rp)"
          name="amount"
          step="0.01"
          type="number"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={expenseLog ? `expense-notes-${expenseLog.id}` : "expense-notes"}>
          Catatan
        </label>
        <textarea
          className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={expenseLog?.notes ?? ""}
          id={expenseLog ? `expense-notes-${expenseLog.id}` : "expense-notes"}
          name="notes"
          placeholder="Catatan biaya"
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
