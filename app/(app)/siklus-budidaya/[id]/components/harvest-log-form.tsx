"use client"

import { useState } from "react"

import { ActionForm } from "@/components/action-form"
import { FormSubmitButton } from "@/components/form-submit-button"
import { buttonVariants } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { HarvestPaymentStatus } from "@/app/generated/prisma/enums"
import { cn } from "@/lib/utils"

import { formatDateInput, formatDecimalInput } from "../../utils"
import type { HarvestTransactionAction, HarvestTransactionItem } from "../types"

export function HarvestTransactionForm({
  action,
  closeTargetId,
  cycleId,
  cycleOptions,
  transaction,
  submitLabel,
}: {
  action: HarvestTransactionAction
  closeTargetId: string
  cycleId?: string
  cycleOptions?: Array<{ label: string; value: string }>
  transaction?: HarvestTransactionItem
  submitLabel: string
}) {
  const resolvedCycleOptions = cycleOptions ?? []
  const defaultCycleId =
    cycleId ?? transaction?.cultureCycleId ?? resolvedCycleOptions[0]?.value
  const initialPaymentStatus = transaction?.paymentStatus ?? HarvestPaymentStatus.PAID
  const [selectedCycleId, setSelectedCycleId] = useState(defaultCycleId ?? "")
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus)
  const hasCycleSelection = Boolean(cycleId || selectedCycleId)

  return (
    <ActionForm
      action={action}
      className="space-y-5 p-5"
      closeTargetId={closeTargetId}
      resetOnSuccess={!transaction}
    >
      {cycleId ? <input name="cycleId" type="hidden" value={cycleId} /> : null}
      {transaction ? <input name="id" type="hidden" value={transaction.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {!cycleId ? (
          <SelectField
            allowEmptyOption={false}
            label="Siklus Budidaya"
            name="cycleId"
            onValueChange={setSelectedCycleId}
            options={resolvedCycleOptions}
            placeholder="Pilih siklus budidaya"
            required
            value={selectedCycleId}
          />
        ) : null}
        <FormField
          defaultValue={transaction?.harvestDate ? formatDateInput(transaction.harvestDate) : getTodayDateInput()}
          label="Tanggal Panen"
          name="harvestDate"
          type="date"
        />
        <FormField
          defaultValue={
            transaction?.totalWeightKg != null ? String(transaction.totalWeightKg) : undefined
          }
          label="Total Berat Panen (kg)"
          name="totalWeightKg"
          step="0.01"
          type="number"
        />
        <FormField
          defaultValue={
            transaction?.harvestedCount != null
              ? String(transaction.harvestedCount)
              : undefined
          }
          label="Jumlah Ikan Terpanen"
          name="harvestedCount"
          type="number"
        />
        <FormField
          defaultValue={formatDecimalInput(transaction?.pricePerKg)}
          label="Harga Jual per kg (Rp)"
          name="pricePerKg"
          step="0.01"
          type="number"
        />
        <FormField
          defaultValue={transaction?.buyerName ?? ""}
          label="Pembeli"
          name="buyerName"
          placeholder="Nama pembeli"
        />
        <SelectField
          allowEmptyOption={false}
          label="Status Pembayaran"
          name="paymentStatus"
          onValueChange={setPaymentStatus}
          options={[
            { label: "Lunas", value: HarvestPaymentStatus.PAID },
            { label: "DP / Sebagian", value: HarvestPaymentStatus.PARTIALLY_PAID },
            { label: "Belum Lunas", value: HarvestPaymentStatus.UNPAID },
          ]}
          value={paymentStatus}
        />
        {paymentStatus !== HarvestPaymentStatus.PAID ? (
          <FormField
            defaultValue={formatDateInput(transaction?.dueDate)}
            label="Jatuh Tempo"
            name="dueDate"
            type="date"
          />
        ) : null}
      </div>

      {!cycleId && !resolvedCycleOptions.length ? (
        <p className="bg-muted text-muted-foreground rounded-md px-3 py-2 text-sm">
          Belum ada siklus budidaya yang tersedia untuk transaksi panen.
        </p>
      ) : null}

      <div className="space-y-2">
        <label
          className="text-sm font-medium"
          htmlFor={transaction ? `harvest-notes-${transaction.id}` : "harvest-notes"}
        >
          Catatan
        </label>
        <textarea
          className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={transaction?.notes ?? ""}
          id={transaction ? `harvest-notes-${transaction.id}` : "harvest-notes"}
          name="notes"
          placeholder="Catatan transaksi panen"
        />
      </div>

      <div className="border-border flex justify-end gap-2 border-t pt-4">
        <DialogClose
          id={closeTargetId}
          render={<button className={cn(buttonVariants({ variant: "outline" }))} type="button" />}
        >
          Batal
        </DialogClose>
        <FormSubmitButton
          disabled={!hasCycleSelection}
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

function SelectField({
  allowEmptyOption = true,
  label,
  name,
  onValueChange,
  options,
  placeholder,
  required = false,
  value,
}: {
  allowEmptyOption?: boolean
  label: string
  name: string
  onValueChange?: (value: string) => void
  options: Array<{ label: string; value: string }>
  placeholder?: string
  required?: boolean
  value?: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <select
        className="border-input bg-white text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
        id={name}
        name={name}
        onChange={(event) => onValueChange?.(event.target.value)}
        required={required}
        value={value}
      >
        {allowEmptyOption ? (
          <option value="">{placeholder ?? "Pilih salah satu"}</option>
        ) : null}
        {options.map((option, index) => (
          <option key={`${name}-${option.value}-${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function getTodayDateInput() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}
