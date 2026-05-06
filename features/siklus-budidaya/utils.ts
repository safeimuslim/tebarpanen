import type { Prisma } from "@/app/generated/prisma/client"
import type { CycleStatus } from "@/app/generated/prisma/enums"

import { cycleStatusLabels } from "./constants"

export function formatDate(value?: Date | string | null) {
  if (!value) {
    return "-"
  }

  const date = value instanceof Date ? value : new Date(value)

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function formatDateInput(value?: Date | string | null) {
  if (!value) {
    return ""
  }

  const date = value instanceof Date ? value : new Date(value)

  return date.toISOString().slice(0, 10)
}

export function formatCurrency(value?: Prisma.Decimal | number | null) {
  if (value == null) {
    return "-"
  }

  const amount =
    typeof value === "number" ? value : Number(value.toString())

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDecimalInput(value?: Prisma.Decimal | number | null) {
  if (value == null) {
    return ""
  }

  return typeof value === "number" ? String(value) : value.toString()
}

export function decimalToNumber(value?: Prisma.Decimal | number | null) {
  if (value == null) {
    return null
  }

  return typeof value === "number" ? value : Number(value.toString())
}

export function formatNumber(value?: number | null) {
  if (value == null) {
    return "-"
  }

  return new Intl.NumberFormat("id-ID").format(value)
}

export function formatWeight(value?: number | null, unit = "g") {
  if (value == null) {
    return "-"
  }

  return `${formatNumber(value)} ${unit}`
}

export function getCycleStatusLabel(status: CycleStatus) {
  return cycleStatusLabels[status]
}

export function getEstimatedAlive(seedCount: number, deadCount: number) {
  return Math.max(seedCount - deadCount, 0)
}

export function getSurvivalRate(seedCount: number, deadCount: number) {
  if (seedCount <= 0) {
    return "-"
  }

  const value = (getEstimatedAlive(seedCount, deadCount) / seedCount) * 100
  return `${value.toFixed(1)}%`
}

export function readText(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? ""
}

export function readRequiredText(formData: FormData, key: string, label: string) {
  const value = readText(formData, key)

  if (!value) {
    throw new Error(`${label} wajib diisi.`)
  }

  return value
}

export function readRequiredInt(formData: FormData, key: string, label: string) {
  const rawValue = readRequiredText(formData, key, label)
  const value = Number.parseInt(rawValue, 10)

  if (!Number.isFinite(value)) {
    throw new Error(`${label} harus berupa angka.`)
  }

  return value
}

export function readRequiredFloat(formData: FormData, key: string, label: string) {
  const rawValue = readRequiredText(formData, key, label)
  const value = Number.parseFloat(rawValue)

  if (!Number.isFinite(value)) {
    throw new Error(`${label} harus berupa angka.`)
  }

  return value
}

export function readRequiredIdList(formData: FormData, key: string, label: string) {
  const values = formData
    .getAll(key)
    .map((value) => value.toString().trim())
    .filter(Boolean)

  if (!values.length) {
    throw new Error(`${label} wajib dipilih.`)
  }

  return Array.from(new Set(values))
}

export function readOptionalFloat(formData: FormData, key: string) {
  const rawValue = readText(formData, key)

  if (!rawValue) {
    return null
  }

  const value = Number.parseFloat(rawValue)

  if (!Number.isFinite(value)) {
    throw new Error("Format angka tidak valid.")
  }

  return value
}

export function readRequiredDate(formData: FormData, key: string, label: string) {
  const rawValue = readRequiredText(formData, key, label)
  const value = new Date(rawValue)

  if (Number.isNaN(value.getTime())) {
    throw new Error(`${label} tidak valid.`)
  }

  return value
}

export function readOptionalDate(formData: FormData, key: string) {
  const rawValue = readText(formData, key)

  if (!rawValue) {
    return null
  }

  const value = new Date(rawValue)

  if (Number.isNaN(value.getTime())) {
    throw new Error("Tanggal tidak valid.")
  }

  return value
}

export function readOptionalDecimal(formData: FormData, key: string) {
  const rawValue = readText(formData, key)

  if (!rawValue) {
    return null
  }

  const value = Number.parseFloat(rawValue)

  if (!Number.isFinite(value)) {
    throw new Error("Nominal tidak valid.")
  }

  return value
}

export function readRequiredDecimal(formData: FormData, key: string, label: string) {
  const rawValue = readRequiredText(formData, key, label)
  const value = Number.parseFloat(rawValue)

  if (!Number.isFinite(value)) {
    throw new Error(`${label} tidak valid.`)
  }

  return value
}

export function getActionErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  ) {
    return "Kolam sudah digunakan dalam siklus aktif lain."
  }

  return "Aksi siklus budidaya gagal diproses."
}
