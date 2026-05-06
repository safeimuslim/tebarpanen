import { PondShape, PondStatus, PondType } from "@/app/generated/prisma/enums"

export const pondTypeLabels: Record<PondType, string> = {
  TERPAL: "Terpal",
  BETON: "Beton",
  TANAH: "Tanah",
}

export const pondShapeLabels: Record<PondShape, string> = {
  RECTANGLE: "Persegi",
  CIRCLE: "Bulat",
  IRREGULAR: "Tidak beraturan",
}

export const pondStatusLabels: Record<PondStatus, string> = {
  ACTIVE: "Aktif",
  EMPTY: "Kosong",
  MAINTENANCE: "Perawatan",
}

export const PONDS_PER_PAGE = 10
