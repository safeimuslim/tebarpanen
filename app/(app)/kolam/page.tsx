import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Eye, Pencil, Plus, Waves } from "lucide-react"

import { auth } from "@/auth"
import { PondShape, PondStatus, PondType } from "@/app/generated/prisma/enums"
import {
  actionError,
  actionSuccess,
  type ActionState,
} from "@/app/lib/action-state"
import { prisma } from "@/app/lib/prisma"
import { ActionForm } from "@/components/action-form"
import { DeleteConfirmButton } from "@/components/delete-confirm-button"
import { FormSubmitButton } from "@/components/form-submit-button"
import { PondShapeDimensionFields } from "@/components/pond-shape-dimension-fields"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const pondTypeLabels: Record<PondType, string> = {
  TERPAL: "Terpal",
  BETON: "Beton",
  TANAH: "Tanah",
}

const pondShapeLabels: Record<PondShape, string> = {
  RECTANGLE: "Persegi",
  CIRCLE: "Bulat",
  IRREGULAR: "Tidak beraturan",
}

const pondStatusLabels: Record<PondStatus, string> = {
  ACTIVE: "Aktif",
  EMPTY: "Kosong",
  MAINTENANCE: "Perawatan",
}

export default async function KolamPage() {
  const ponds = await prisma.pond.findMany({
    orderBy: [{ createdAt: "desc" }, { name: "asc" }],
  })

  const activeCount = ponds.filter((pond) => pond.status === "ACTIVE").length
  const maintenanceCount = ponds.filter(
    (pond) => pond.status === "MAINTENANCE"
  ).length
  const totalPurchasePrice = ponds.reduce(
    (total, pond) => total + decimalToNumber(pond.purchasePrice),
    0
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Master Data</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Kolam</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Data kolam yang dapat dipilih saat membuat siklus budidaya.
          </p>
        </div>

        <button
          className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          popoverTarget="create-pond-modal"
          type="button"
        >
          <Plus className="size-4" />
          Tambah Kolam
        </button>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Total Kolam" value={String(ponds.length)} />
        <SummaryCard label="Aktif" value={String(activeCount)} />
        <SummaryCard label="Perawatan" value={String(maintenanceCount)} />
        <SummaryCard
          label="Nilai Pembelian Kolam"
          value={formatCurrency(totalPurchasePrice)}
        />
      </section>

      <section className="border-border bg-card text-card-foreground overflow-hidden rounded-lg border shadow-sm">
        <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">List Kolam</h2>
            <p className="text-muted-foreground text-sm">
              Data master kolam yang sudah tersimpan di database.
            </p>
          </div>
          <span className="text-muted-foreground text-sm">
            {ponds.length} kolam
          </span>
        </div>

        {ponds.length ? (
          <div className="divide-border divide-y">
            {ponds.map((pond) => (
              <article
                className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
                key={pond.id}
              >
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                      <Waves className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{pond.name}</h3>
                      <p className="text-muted-foreground text-sm">{pond.code}</p>
                    </div>
                    <span className="border-border bg-muted rounded-full border px-2 py-0.5 text-xs font-medium">
                      {pondStatusLabels[pond.status]}
                    </span>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4 lg:grid-cols-1">
                  <MasterMetric label="Jenis" value={pondTypeLabels[pond.type]} />
                  <MasterMetric label="Bentuk" value={pondShapeLabels[pond.shape]} />
                  <MasterMetric label="Kapasitas" value={formatCapacity(pond.capacity)} />
                  <MasterMetric
                    label="Harga Pembelian"
                    value={formatCurrency(pond.purchasePrice)}
                  />
                </dl>

                <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                  <button
                    className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-2")}
                    popoverTarget={`detail-pond-${pond.id}`}
                    type="button"
                  >
                    <Eye className="size-4" />
                    Detail
                  </button>
                  <button
                    className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-2")}
                    popoverTarget={`edit-pond-${pond.id}`}
                    type="button"
                  >
                    <Pencil className="size-4" />
                    Edit
                  </button>
                  <DeleteConfirmButton
                    action={deletePond}
                    description="Data kolam yang dihapus tidak bisa dikembalikan untuk"
                    id={pond.id}
                    itemName={pond.name}
                  />
                </div>

                <PondDetailModal pond={pond} />
                <PondEditModal pond={pond} />
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="bg-muted mx-auto flex size-12 items-center justify-center rounded-lg">
              <Waves className="size-6" />
            </div>
            <h2 className="mt-4 font-semibold">Belum ada kolam</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Tambahkan kolam pertama untuk mulai menyusun data master.
            </p>
          </div>
        )}
      </section>

      <div
        className="backdrop:bg-foreground/30 open:flex fixed inset-0 m-auto hidden h-fit max-h-[90vh] w-[min(92vw,42rem)] overflow-y-auto rounded-lg border border-border bg-card p-0 text-card-foreground shadow-lg"
        id="create-pond-modal"
        popover="auto"
      >
        <div className="w-full">
          <div className="border-border border-b p-5">
            <p className="text-muted-foreground text-sm">Form Master Data</p>
            <h2 className="mt-1 text-xl font-semibold">Tambah Kolam</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Data kolam akan tersimpan ke database.
            </p>
          </div>

          <PondForm action={createPond} submitLabel="Simpan Kolam" />
        </div>
      </div>
    </div>
  )
}

async function createPond(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  "use server"

  await requireAuthenticatedUser()

  try {
    const name = readRequiredString(formData, "name")
    const shape = readEnum(formData, "shape", PondShape)

    await prisma.pond.create({
      data: {
        name,
        code: await createUniquePondCode(name),
        type: readEnum(formData, "type", PondType),
        shape,
        status: readEnum(formData, "status", PondStatus),
        lengthM:
          shape === "RECTANGLE" ? readOptionalFloat(formData, "lengthM") : null,
        widthM:
          shape === "RECTANGLE" ? readOptionalFloat(formData, "widthM") : null,
        diameterM:
          shape === "CIRCLE" ? readOptionalFloat(formData, "diameterM") : null,
        depthM: readOptionalFloat(formData, "depthM"),
        capacity: readOptionalInt(formData, "capacity"),
        purchasePrice: readOptionalDecimal(formData, "purchasePrice"),
        installedAt: readOptionalDate(formData, "installedAt"),
        depreciationMonths: readOptionalInt(formData, "depreciationMonths"),
        notes: readOptionalString(formData, "notes"),
      },
    })

    revalidatePath("/kolam")
    return actionSuccess("Kolam berhasil ditambahkan.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

async function updatePond(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  "use server"

  await requireAuthenticatedUser()

  try {
    const shape = readEnum(formData, "shape", PondShape)

    await prisma.pond.update({
      where: {
        id: readRequiredString(formData, "id"),
      },
      data: {
        name: readRequiredString(formData, "name"),
        type: readEnum(formData, "type", PondType),
        shape,
        status: readEnum(formData, "status", PondStatus),
        lengthM:
          shape === "RECTANGLE" ? readOptionalFloat(formData, "lengthM") : null,
        widthM:
          shape === "RECTANGLE" ? readOptionalFloat(formData, "widthM") : null,
        diameterM:
          shape === "CIRCLE" ? readOptionalFloat(formData, "diameterM") : null,
        depthM: readOptionalFloat(formData, "depthM"),
        capacity: readOptionalInt(formData, "capacity"),
        purchasePrice: readOptionalDecimal(formData, "purchasePrice"),
        installedAt: readOptionalDate(formData, "installedAt"),
        depreciationMonths: readOptionalInt(formData, "depreciationMonths"),
        notes: readOptionalString(formData, "notes"),
      },
    })

    revalidatePath("/kolam")
    return actionSuccess("Kolam berhasil diperbarui.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

async function deletePond(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  "use server"

  await requireAuthenticatedUser()

  try {
    const id = readRequiredString(formData, "id")
    const activeCycles = await prisma.cultureCycle.count({
      where: {
        pondId: id,
      },
    })

    if (activeCycles > 0) {
      return actionError(
        "Kolam tidak bisa dihapus karena masih dipakai di siklus budidaya."
      )
    }

    await prisma.pond.delete({
      where: {
        id,
      },
    })

    revalidatePath("/kolam")
    return actionSuccess("Kolam berhasil dihapus.")
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

async function createUniquePondCode(name: string) {
  const baseCode = slugify(name) || "kolam"
  let code = baseCode
  let index = 2

  while (await prisma.pond.findUnique({ where: { code } })) {
    code = `${baseCode}-${index}`
    index += 1
  }

  return code
}

function PondForm({
  action,
  pond,
  submitLabel,
}: {
  action: (
    previousState: ActionState,
    formData: FormData
  ) => Promise<ActionState>
  pond?: PondFormData
  submitLabel: string
}) {
  return (
    <ActionForm
      action={action}
      className="space-y-5 p-5"
      closePopoverId={pond ? `edit-pond-${pond.id}` : "create-pond-modal"}
      resetOnSuccess={!pond}
    >
      {pond ? <input name="id" type="hidden" value={pond.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Nama Kolam" name="name" defaultValue={pond?.name} />
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
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={pond?.notes ?? ""}
          id={pond ? `notes-${pond.id}` : "notes"}
          name="notes"
          placeholder="Catatan kolam"
        />
      </div>

      <div className="border-border flex justify-end gap-2 border-t pt-4">
        <button
          className={cn(buttonVariants({ variant: "outline" }))}
          popoverTarget={pond ? `edit-pond-${pond.id}` : "create-pond-modal"}
          popoverTargetAction="hide"
          type="button"
        >
          Batal
        </button>
        <FormSubmitButton pendingLabel="Menyimpan..." type="submit">
          {submitLabel}
        </FormSubmitButton>
      </div>
    </ActionForm>
  )
}

function PondDetailModal({ pond }: { pond: PondFormData }) {
  return (
    <div
      className="backdrop:bg-foreground/30 open:flex fixed inset-0 m-auto hidden h-fit w-[min(92vw,42rem)] rounded-lg border border-border bg-card p-0 text-card-foreground shadow-lg"
      id={`detail-pond-${pond.id}`}
      popover="auto"
    >
      <div className="w-full">
        <div className="border-border border-b p-5">
          <p className="text-muted-foreground text-sm">Detail Kolam</p>
          <h2 className="mt-1 text-xl font-semibold">{pond.name}</h2>
          <p className="text-muted-foreground mt-1 text-sm">{pond.code}</p>
        </div>
        <dl className="grid gap-4 p-5 md:grid-cols-2">
          <MasterMetric label="Kode" value={pond.code} />
          <MasterMetric label="Jenis" value={pondTypeLabels[pond.type]} />
          <MasterMetric label="Bentuk" value={pondShapeLabels[pond.shape]} />
          <MasterMetric label="Status" value={pondStatusLabels[pond.status]} />
          <MasterMetric label="Dimensi" value={formatPondSize(pond)} />
          <MasterMetric label="Kapasitas" value={formatCapacity(pond.capacity)} />
          <MasterMetric
            label="Harga Pembelian"
            value={formatCurrency(pond.purchasePrice)}
          />
          <MasterMetric
            label="Tanggal Pasang"
            value={formatDateDisplay(pond.installedAt)}
          />
          <MasterMetric
            label="Masa Penyusutan"
            value={formatDepreciationMonths(pond.depreciationMonths)}
          />
          <div className="md:col-span-2">
            <MasterMetric label="Catatan" value={pond.notes ?? "-"} />
          </div>
        </dl>
        <div className="border-border flex justify-end border-t p-5">
          <button
            className={cn(buttonVariants({ variant: "outline" }))}
            popoverTarget={`detail-pond-${pond.id}`}
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

function PondEditModal({ pond }: { pond: PondFormData }) {
  return (
    <div
      className="backdrop:bg-foreground/30 open:flex fixed inset-0 m-auto hidden h-fit max-h-[90vh] w-[min(92vw,42rem)] overflow-y-auto rounded-lg border border-border bg-card p-0 text-card-foreground shadow-lg"
      id={`edit-pond-${pond.id}`}
      popover="auto"
    >
      <div className="w-full">
        <div className="border-border border-b p-5">
          <p className="text-muted-foreground text-sm">Form Master Data</p>
          <h2 className="mt-1 text-xl font-semibold">Edit Kolam</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Perbarui data kolam yang tersimpan di database.
          </p>
        </div>

        <PondForm action={updatePond} pond={pond} submitLabel="Simpan Perubahan" />
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

type PondFormData = Awaited<ReturnType<typeof prisma.pond.findMany>>[number]

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

  return "Terjadi kesalahan saat memproses data kolam."
}

function readOptionalFloat(formData: FormData, key: string) {
  const value = readOptionalString(formData, key)

  if (!value) {
    return null
  }

  const number = Number(value.replace(",", "."))

  if (!Number.isFinite(number)) {
    throw new Error(`${key} harus berupa angka`)
  }

  return number
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

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function formatPondSize(pond: PondFormData) {
  const depth = formatDimension(pond.depthM)

  if (pond.shape === "CIRCLE") {
    const diameter = formatDimension(pond.diameterM)

    if (diameter === "-" && depth === "-") {
      return "-"
    }

    return `Diameter ${diameter} x kedalaman ${depth}`
  }

  if (pond.shape === "IRREGULAR") {
    return depth === "-" ? "-" : `Kedalaman ${depth}`
  }

  const length = formatDimension(pond.lengthM)
  const width = formatDimension(pond.widthM)

  if (length === "-" && width === "-" && depth === "-") {
    return "-"
  }

  return `${length} x ${width} x ${depth}`
}

function formatDimension(value: number | null) {
  return value === null ? "-" : `${formatNumber(value)} m`
}

function formatCapacity(value: number | null) {
  return value === null ? "-" : `${formatNumber(value)} ekor`
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value)
}

function formatNumberInput(value: number | null | undefined) {
  return value === null || value === undefined ? "" : String(value)
}

function formatDecimalInput(value: DecimalLike | null | undefined) {
  return value === null || value === undefined ? "" : value.toString()
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

function decimalToNumber(value: DecimalLike | null) {
  return value ? Number(value.toString()) : 0
}

type DecimalLike = {
  toString(): string
}
