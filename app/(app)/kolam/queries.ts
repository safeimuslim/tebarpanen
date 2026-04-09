import { type Prisma } from "@/app/generated/prisma/client"
import { PondShape, PondStatus, PondType } from "@/app/generated/prisma/enums"
import {
  getFarmScopeWhere,
  requireSessionUser,
  type SessionAppUser,
} from "@/app/lib/authz"
import { prisma } from "@/app/lib/prisma"

import { PONDS_PER_PAGE } from "./constants"
import type { PondFilters, PondPageData } from "./types"
import {
  decimalToNumber,
  getCurrentPage,
  readEnumSearchParam,
  readSearchParam,
  type PondWhereFilters,
} from "./utils"

export async function getPondPageData(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
): Promise<PondPageData> {
  const user = await requireSessionUser()
  const filters = await readPondFilters(searchParams)
  const requestedPage = getCurrentPage(filters.page)
  const where = buildPondWhere(filters, user)
  const [totalCount, activeCount, maintenanceCount, purchaseAggregate] =
    await Promise.all([
      prisma.pond.count({ where }),
      prisma.pond.count({ where: { ...where, status: "ACTIVE" } }),
      prisma.pond.count({ where: { ...where, status: "MAINTENANCE" } }),
      prisma.pond.aggregate({
        where,
        _sum: {
          purchasePrice: true,
        },
      }),
    ])

  const totalPages = Math.max(1, Math.ceil(totalCount / PONDS_PER_PAGE))
  const currentPage = Math.min(requestedPage, totalPages)
  const ponds = await prisma.pond.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { name: "asc" }],
    skip: (currentPage - 1) * PONDS_PER_PAGE,
    take: PONDS_PER_PAGE,
  })

  return {
    activeCount,
    currentPage,
    filters,
    maintenanceCount,
    ponds,
    totalCount,
    totalPages,
    totalPurchasePrice: decimalToNumber(purchaseAggregate._sum.purchasePrice),
  }
}

export async function readPondFilters(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
): Promise<PondFilters> {
  const params = await searchParams

  return {
    page: readSearchParam(params.page),
    query: readSearchParam(params.query),
    shape: readEnumSearchParam(params.shape, PondShape),
    status: readEnumSearchParam(params.status, PondStatus),
    type: readEnumSearchParam(params.type, PondType),
  }
}

function buildPondWhere(
  filters: PondWhereFilters,
  user: Pick<SessionAppUser, "role" | "farmId">
) {
  return {
    ...getFarmScopeWhere<Prisma.PondWhereInput>(user),
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
              code: {
                contains: filters.query,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.shape ? { shape: filters.shape } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  } satisfies Prisma.PondWhereInput
}
