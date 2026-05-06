import type { PondShape, PondStatus, PondType } from "@/app/generated/prisma/enums"

import type { PondFormData } from "./types"

type DecimalLike = {
  toString(): string
}

export function readRequiredString(formData: FormData, key: string) {
  const value = readOptionalString(formData, key)

  if (!value) {
    throw new Error(`${key} wajib diisi`)
  }

  return value
}

export function readOptionalString(formData: FormData, key: string) {
  const value = formData.get(key)

  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()
  return trimmed || null
}

export function readOptionalFloat(formData: FormData, key: string) {
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

export function readOptionalInt(formData: FormData, key: string) {
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

export function readOptionalDecimal(formData: FormData, key: string) {
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

export function readOptionalDate(formData: FormData, key: string) {
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

export function readEnum<TEnum extends Record<string, string>>(
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

export function readSearchParam(value: string | string[] | undefined) {
  const normalized = Array.isArray(value) ? value[0] : value
  const trimmed = normalized?.trim() ?? ""

  return trimmed
}

export function readEnumSearchParam<TValue extends string>(
  value: string | string[] | undefined,
  enumObject: Record<string, TValue>
): TValue | undefined {
  const normalized = readSearchParam(value)

  if (!normalized) {
    return undefined
  }

  return normalized in enumObject ? (normalized as TValue) : undefined
}

export function getCurrentPage(page: string) {
  const parsed = Number(page)

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return Math.floor(parsed)
}

export function getActionErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return "Terjadi kesalahan saat memproses data kolam."
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function formatPondSize(pond: PondFormData) {
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

export function formatDimension(value: number | null) {
  return value === null ? "-" : `${formatNumber(value)} m`
}

export function formatCapacity(value: number | null) {
  return value === null ? "-" : `${formatNumber(value)} ekor`
}

export function formatCurrency(value: DecimalLike | number | null) {
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

export function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value)
}

export function formatNumberInput(value: number | null | undefined) {
  return value === null || value === undefined ? "" : String(value)
}

export function formatDecimalInput(value: DecimalLike | null | undefined) {
  return value === null || value === undefined ? "" : value.toString()
}

export function formatDateInput(value: Date | null | undefined) {
  return value ? value.toISOString().slice(0, 10) : ""
}

export function formatDateDisplay(value: Date | null) {
  return value
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeZone: "UTC",
      }).format(value)
    : "-"
}

export function formatDepreciationMonths(value: number | null) {
  return value === null ? "-" : `${formatNumber(value)} bulan`
}

export function decimalToNumber(value: DecimalLike | null) {
  return value ? Number(value.toString()) : 0
}

export type PondWhereFilters = {
  query: string
  shape?: PondShape
  status?: PondStatus
  type?: PondType
}
