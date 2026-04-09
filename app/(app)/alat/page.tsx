import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ClipboardCheck, Eye, Pencil, Plus, Wrench } from "lucide-react"

import { auth } from "@/auth"
import {
  EquipmentCondition,
  EquipmentType,
} from "@/app/generated/prisma/enums"
import {
  actionError,
  actionSuccess,
  type ActionState,
} from "@/app/lib/action-state"
import { prisma } from "@/app/lib/prisma"
import { ActionForm } from "@/components/action-form"
import { DeleteConfirmButton } from "@/components/delete-confirm-button"
import { FormSubmitButton } from "@/components/form-submit-button"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const equipmentTypeLabels: Record<EquipmentType, string> = {
  WATER_QUALITY_METER: "Pengukur Kualitas Air",
  SCALE: "Timbangan",
  HARVEST_EQUIPMENT: "Peralatan Panen",
  FEED_EQUIPMENT: "Peralatan Pakan",
  AERATION_OXYGEN: "Aerasi / Oksigen",
  PUMP_CIRCULATION: "Pompa & Sirkulasi",
  CONTAINER_STORAGE: "Wadah & Penyimpanan",
  CLEANING_EQUIPMENT: "Peralatan Kebersihan",
  OTHER: "Lainnya",
}

const equipmentConditionLabels: Record<EquipmentCondition, string> = {
  READY: "Siap pakai",
  NEEDS_CHECK: "Perlu cek",
  BROKEN: "Rusak",
}

export default async function AlatPage() {
  const equipment = await prisma.equipment.findMany({
    orderBy: [{ createdAt: "desc" }, { name: "asc" }],
  })

  const readyCount = equipment.filter((item) => item.condition === "READY").length
  const needsCheckCount = equipment.filter(
    (item) => item.condition === "NEEDS_CHECK"
  ).length
  const totalPurchasePrice = equipment.reduce(
    (total, item) => total + decimalToNumber(item.purchasePrice),
    0
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Master Data</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Alat</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Data alat yang dimiliki untuk operasional budidaya dan pencatatan.
          </p>
        </div>

        <button
          className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          popoverTarget="create-equipment-modal"
          type="button"
        >
          <Plus className="size-4" />
          Tambah Alat
        </button>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Total Alat" value={String(equipment.length)} />
        <SummaryCard label="Siap Pakai" value={String(readyCount)} />
        <SummaryCard label="Perlu Cek" value={String(needsCheckCount)} />
        <SummaryCard
          label="Nilai Pembelian Alat"
          value={formatCurrency(totalPurchasePrice)}
        />
      </section>

      <section className="border-border bg-card text-card-foreground overflow-hidden rounded-lg border shadow-sm">
        <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">List Alat</h2>
            <p className="text-muted-foreground text-sm">
              Data master alat yang sudah tersimpan di database.
            </p>
          </div>
          <span className="text-muted-foreground text-sm">
            {equipment.length} alat
          </span>
        </div>

        {equipment.length ? (
          <div className="divide-border divide-y">
            {equipment.map((item) => (
              <article
                className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
                key={item.id}
              >
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                      <Wrench className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {equipmentTypeLabels[item.type]}
                      </p>
                    </div>
                    <span className="border-border bg-muted rounded-full border px-2 py-0.5 text-xs font-medium">
                      {equipmentConditionLabels[item.condition]}
                    </span>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4 lg:grid-cols-1">
                  <MasterMetric label="Jenis" value={equipmentTypeLabels[item.type]} />
                  <MasterMetric label="Jumlah" value={formatQuantity(item.quantity)} />
                  <MasterMetric
                    label="Kalibrasi"
                    value={formatDateDisplay(item.calibrationDate)}
                  />
                  <MasterMetric
                    label="Harga Pembelian"
                    value={formatCurrency(item.purchasePrice)}
                  />
                </dl>

                <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                  <button
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" }),
                      "gap-2"
                    )}
                    popoverTarget={`detail-equipment-${item.id}`}
                    type="button"
                  >
                    <Eye className="size-4" />
                    Detail
                  </button>
                  <button
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" }),
                      "gap-2"
                    )}
                    popoverTarget={`edit-equipment-${item.id}`}
                    type="button"
                  >
                    <Pencil className="size-4" />
                    Edit
                  </button>
                  <DeleteConfirmButton
                    action={deleteEquipment}
                    description="Data alat yang dihapus tidak bisa dikembalikan untuk"
                    id={item.id}
                    itemName={item.name}
                  />
                </div>

                <EquipmentDetailModal equipment={item} />
                <EquipmentEditModal equipment={item} />
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="bg-muted mx-auto flex size-12 items-center justify-center rounded-lg">
              <Wrench className="size-6" />
            </div>
            <h2 className="mt-4 font-semibold">Belum ada alat</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Tambahkan alat pertama untuk mulai menyusun data master.
            </p>
          </div>
        )}
      </section>

      <div
        className="backdrop:bg-foreground/30 open:flex fixed inset-0 m-auto hidden h-fit max-h-[90vh] w-[min(92vw,42rem)] overflow-y-auto rounded-lg border border-border bg-card p-0 text-card-foreground shadow-lg"
        id="create-equipment-modal"
        popover="auto"
      >
        <div className="w-full">
          <div className="border-border border-b p-5">
            <p className="text-muted-foreground text-sm">Form Master Data</p>
            <h2 className="mt-1 text-xl font-semibold">Tambah Alat</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Data alat akan tersimpan ke database.
            </p>
          </div>

          <EquipmentForm action={createEquipment} submitLabel="Simpan Alat" />
        </div>
      </div>
    </div>
  )
}

async function createEquipment(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  "use server"

  await requireAuthenticatedUser()

  try {
    await prisma.equipment.create({
      data: readEquipmentFormData(formData),
    })

    revalidatePath("/alat")
    return actionSuccess("Alat berhasil ditambahkan.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

async function updateEquipment(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  "use server"

  await requireAuthenticatedUser()

  try {
    await prisma.equipment.update({
      where: {
        id: readRequiredString(formData, "id"),
      },
      data: readEquipmentFormData(formData),
    })

    revalidatePath("/alat")
    return actionSuccess("Alat berhasil diperbarui.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

async function deleteEquipment(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  "use server"

  await requireAuthenticatedUser()

  try {
    await prisma.equipment.delete({
      where: {
        id: readRequiredString(formData, "id"),
      },
    })

    revalidatePath("/alat")
    return actionSuccess("Alat berhasil dihapus.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

async function requireAuthenticatedUser() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }
}

function readEquipmentFormData(formData: FormData) {
  return {
    name: readRequiredString(formData, "name"),
    type: readEnum(formData, "type", EquipmentType),
    quantity: readRequiredInt(formData, "quantity"),
    brand: readOptionalString(formData, "brand"),
    serialNumber: readOptionalString(formData, "serialNumber"),
    calibrationDate: readOptionalDate(formData, "calibrationDate"),
    condition: readEnum(formData, "condition", EquipmentCondition),
    purchasePrice: readOptionalDecimal(formData, "purchasePrice"),
    purchasedAt: readOptionalDate(formData, "purchasedAt"),
    depreciationMonths: readOptionalInt(formData, "depreciationMonths"),
    notes: readOptionalString(formData, "notes"),
  }
}

function EquipmentForm({
  action,
  equipment,
  submitLabel,
}: {
  action: (
    previousState: ActionState,
    formData: FormData
  ) => Promise<ActionState>
  equipment?: EquipmentFormData
  submitLabel: string
}) {
  return (
    <ActionForm
      action={action}
      className="space-y-5 p-5"
      closePopoverId={
        equipment ? `edit-equipment-${equipment.id}` : "create-equipment-modal"
      }
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
        <button
          className={cn(buttonVariants({ variant: "outline" }))}
          popoverTarget={
            equipment ? `edit-equipment-${equipment.id}` : "create-equipment-modal"
          }
          popoverTargetAction="hide"
          type="button"
        >
          Batal
        </button>
        <FormSubmitButton className="gap-2" pendingLabel="Menyimpan..." type="submit">
          <ClipboardCheck className="size-4" />
          {submitLabel}
        </FormSubmitButton>
      </div>
    </ActionForm>
  )
}

function EquipmentDetailModal({
  equipment,
}: {
  equipment: EquipmentFormData
}) {
  return (
    <div
      className="backdrop:bg-foreground/30 open:flex fixed inset-0 m-auto hidden h-fit w-[min(92vw,42rem)] rounded-lg border border-border bg-card p-0 text-card-foreground shadow-lg"
      id={`detail-equipment-${equipment.id}`}
      popover="auto"
    >
      <div className="w-full">
        <div className="border-border border-b p-5">
          <p className="text-muted-foreground text-sm">Detail Alat</p>
          <h2 className="mt-1 text-xl font-semibold">{equipment.name}</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {equipmentTypeLabels[equipment.type]}
          </p>
        </div>
        <dl className="grid gap-4 p-5 md:grid-cols-2">
          <MasterMetric
            label="Jenis"
            value={equipmentTypeLabels[equipment.type]}
          />
          <MasterMetric
            label="Kondisi"
            value={equipmentConditionLabels[equipment.condition]}
          />
          <MasterMetric label="Jumlah" value={formatQuantity(equipment.quantity)} />
          <MasterMetric label="Merek" value={equipment.brand ?? "-"} />
          <MasterMetric label="Nomor Seri" value={equipment.serialNumber ?? "-"} />
          <MasterMetric
            label="Tanggal Kalibrasi"
            value={formatDateDisplay(equipment.calibrationDate)}
          />
          <MasterMetric
            label="Harga Pembelian"
            value={formatCurrency(equipment.purchasePrice)}
          />
          <MasterMetric
            label="Tanggal Pembelian"
            value={formatDateDisplay(equipment.purchasedAt)}
          />
          <MasterMetric
            label="Masa Penyusutan"
            value={formatDepreciationMonths(equipment.depreciationMonths)}
          />
          <div className="md:col-span-2">
            <MasterMetric label="Catatan" value={equipment.notes ?? "-"} />
          </div>
        </dl>
        <div className="border-border flex justify-end border-t p-5">
          <button
            className={cn(buttonVariants({ variant: "outline" }))}
            popoverTarget={`detail-equipment-${equipment.id}`}
            popoverTargetAction="hide"
            type="button"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

function EquipmentEditModal({ equipment }: { equipment: EquipmentFormData }) {
  return (
    <div
      className="backdrop:bg-foreground/30 open:flex fixed inset-0 m-auto hidden h-fit max-h-[90vh] w-[min(92vw,42rem)] overflow-y-auto rounded-lg border border-border bg-card p-0 text-card-foreground shadow-lg"
      id={`edit-equipment-${equipment.id}`}
      popover="auto"
    >
      <div className="w-full">
        <div className="border-border border-b p-5">
          <p className="text-muted-foreground text-sm">Form Master Data</p>
          <h2 className="mt-1 text-xl font-semibold">Edit Alat</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Perbarui data alat yang tersimpan di database.
          </p>
        </div>

        <EquipmentForm
          action={updateEquipment}
          equipment={equipment}
          submitLabel="Simpan Perubahan"
        />
      </div>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border bg-card rounded-lg border p-4 shadow-sm">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  )
}

function MasterMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
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
        {Object.entries(options).map(([value, label]) => (
          <option key={value} value={value}>
            {label as string}
          </option>
        ))}
      </select>
    </div>
  )
}

type EquipmentFormData = Awaited<
  ReturnType<typeof prisma.equipment.findMany>
>[number]

function readRequiredString(formData: FormData, key: string) {
  const value = readOptionalString(formData, key)

  if (!value) {
    throw new Error(`${key} wajib diisi`)
  }

  return value
}

function readOptionalString(formData: FormData, key: string) {
  const value = formData.get(key)

  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()
  return trimmed || null
}

function getActionErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return "Terjadi kesalahan saat memproses data alat."
}

function readRequiredInt(formData: FormData, key: string) {
  const value = readOptionalInt(formData, key)

  if (value === null) {
    throw new Error(`${key} wajib diisi`)
  }

  return value
}

function readOptionalInt(formData: FormData, key: string) {
  const value = readOptionalString(formData, key)

  if (!value) {
    return null
  }

  const number = Number(value)

  if (!Number.isInteger(number)) {
    throw new Error(`${key} harus berupa angka bulat`)
  }

  return number
}

function readOptionalDecimal(formData: FormData, key: string) {
  const value = readOptionalString(formData, key)

  if (!value) {
    return null
  }

  const normalized = value.replace(",", ".")
  const number = Number(normalized)

  if (!Number.isFinite(number)) {
    throw new Error(`${key} harus berupa angka`)
  }

  return normalized
}

function readOptionalDate(formData: FormData, key: string) {
  const value = readOptionalString(formData, key)

  if (!value) {
    return null
  }

  const date = new Date(`${value}T00:00:00.000Z`)

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${key} harus berupa tanggal valid`)
  }

  return date
}

function readEnum<TEnum extends Record<string, string>>(
  formData: FormData,
  key: string,
  enumObject: TEnum
) {
  const value = readRequiredString(formData, key)
  const enumValues = Object.values(enumObject)

  if (!enumValues.includes(value)) {
    throw new Error(`${key} tidak valid`)
  }

  return value as TEnum[keyof TEnum]
}

function formatQuantity(value: number) {
  return `${formatNumber(value)} unit`
}

function formatCurrency(value: DecimalLike | number | null) {
  const number = typeof value === "number" ? value : decimalToNumber(value)

  if (!number) {
    return "-"
  }

  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(number)
}

function formatDateInput(value: Date | null | undefined) {
  return value ? value.toISOString().slice(0, 10) : ""
}

function formatDateDisplay(value: Date | null) {
  return value
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeZone: "UTC",
      }).format(value)
    : "-"
}

function formatDepreciationMonths(value: number | null) {
  return value === null ? "-" : `${formatNumber(value)} bulan`
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value)
}

function formatNumberInput(value: number | null | undefined) {
  return value === null || value === undefined ? "" : String(value)
}

function formatDecimalInput(value: DecimalLike | null | undefined) {
  return value === null || value === undefined ? "" : value.toString()
}

function decimalToNumber(value: DecimalLike | null) {
  return value ? Number(value.toString()) : 0
}

type DecimalLike = {
  toString(): string
}
