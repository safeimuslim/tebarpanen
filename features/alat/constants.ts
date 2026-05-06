import { EquipmentCondition, EquipmentType } from "@/app/generated/prisma/enums"

export const equipmentTypeLabels: Record<EquipmentType, string> = {
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

export const equipmentConditionLabels: Record<EquipmentCondition, string> = {
  READY: "Siap pakai",
  NEEDS_CHECK: "Perlu cek",
  BROKEN: "Rusak",
}

export const EQUIPMENT_PER_PAGE = 10
