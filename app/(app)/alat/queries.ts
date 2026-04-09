import { type Prisma } from "@/app/generated/prisma/client"
import {
  EquipmentCondition,
  EquipmentType,
} from "@/app/generated/prisma/enums"
import { prisma } from "@/app/lib/prisma"

import { EQUIPMENT_PER_PAGE } from "./constants"
import type { EquipmentFilters, EquipmentPageData } from "./types"
import {
  decimalToNumber,
  getCurrentPage,
  readEnumSearchParam,
  readSearchParam,
  type EquipmentWhereFilters,
} from "./utils"

export async function getEquipmentPageData(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
): Promise<EquipmentPageData> {
  const filters = await readEquipmentFilters(searchParams)
  const requestedPage = getCurrentPage(filters.page)
  const where = buildEquipmentWhere(filters)
  const [totalCount, readyCount, needsCheckCount, purchaseAggregate] =
    await Promise.all([
      prisma.equipment.count({ where }),
      prisma.equipment.count({ where: { ...where, condition: "READY" } }),
      prisma.equipment.count({ where: { ...where, condition: "NEEDS_CHECK" } }),
      prisma.equipment.aggregate({
        where,
        _sum: {
          purchasePrice: true,
        },
      }),
    ])

  const totalPages = Math.max(1, Math.ceil(totalCount / EQUIPMENT_PER_PAGE))
  const currentPage = Math.min(requestedPage, totalPages)
  const equipment = await prisma.equipment.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { name: "asc" }],
    skip: (currentPage - 1) * EQUIPMENT_PER_PAGE,
    take: EQUIPMENT_PER_PAGE,
  })

  return {
    currentPage,
    equipment,
    filters,
    needsCheckCount,
    readyCount,
    totalCount,
    totalPages,
    totalPurchasePrice: decimalToNumber(purchaseAggregate._sum.purchasePrice),
  }
}

export async function readEquipmentFilters(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
): Promise<EquipmentFilters> {
  const params = await searchParams

  return {
    condition: readEnumSearchParam(params.condition, EquipmentCondition),
    page: readSearchParam(params.page),
    query: readSearchParam(params.query),
    type: readEnumSearchParam(params.type, EquipmentType),
  }
}

function buildEquipmentWhere(filters: EquipmentWhereFilters) {
  return {
    ...(filters.query
      ? {
          OR: [
            {
              name: {
                contains: filters.query,
                mode: "insensitive",
              },
            },
            {
              brand: {
                contains: filters.query,
                mode: "insensitive",
              },
            },
            {
              serialNumber: {
                contains: filters.query,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.condition ? { condition: filters.condition } : {}),
  } satisfies Prisma.EquipmentWhereInput
}
