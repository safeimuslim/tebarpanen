import type { Prisma } from "@/app/generated/prisma/client"
import { HarvestPaymentStatus } from "@/app/generated/prisma/enums"
import { requireSessionUser } from "@/app/lib/authz"
import { prisma } from "@/app/lib/prisma"

import { decimalToNumber } from "../siklus-budidaya/utils"

export type TransactionFilters = {
  buyer: string
  period: string
  query: string
  status: string
}

export type HarvestTransactionListItem = {
  id: string
  invoiceNumber: string
  cultureCycleId: string
  harvestDate: Date
  totalWeightKg: number
  harvestedCount: number
  buyerName: string
  pricePerKg: number
  grossAmount: number
  dueDate: Date | null
  paymentStatus: HarvestPaymentStatus
  notes: string | null
  createdAt: Date
  updatedAt: Date
  cultureCycle: {
    id: string
    cycleName: string
  }
}

export type HarvestTransactionPageData = {
  buyerOptions: string[]
  cycleOptions: Array<{ label: string; value: string }>
  filters: TransactionFilters
  totalRevenue: number
  totalTransactions: number
  totalWeightKg: number
  transactions: HarvestTransactionListItem[]
}

export async function getHarvestTransactionPageData(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
): Promise<HarvestTransactionPageData> {
  const user = await requireSessionUser()
  const params = await searchParams
  const filters = readFilters(params)
  const relationWhere =
    user.role === "SUPER_ADMIN" || !user.farmId
      ? {}
      : { cultureCycle: { farmId: user.farmId } }
  const where: Prisma.HarvestTransactionWhereInput = {
    ...relationWhere,
    ...readPeriodWhere(filters.period),
    ...readStatusWhere(filters.status),
    ...(filters.buyer ? { buyerName: filters.buyer } : {}),
    ...(filters.query
      ? {
          OR: [
            { invoiceNumber: { contains: filters.query, mode: "insensitive" } },
            { buyerName: { contains: filters.query, mode: "insensitive" } },
            {
              cultureCycle: {
                cycleName: {
                  contains: filters.query,
                  mode: "insensitive",
                },
              },
            },
          ],
        }
      : {}),
  }

  const [transactions, buyers, cycles] = await Promise.all([
    prisma.harvestTransaction.findMany({
      where,
      orderBy: [{ harvestDate: "desc" }, { createdAt: "desc" }],
      include: {
        cultureCycle: {
          select: {
            cycleName: true,
            id: true,
          },
        },
      },
    }),
    prisma.harvestTransaction.findMany({
      where: relationWhere,
      distinct: ["buyerName"],
      orderBy: {
        buyerName: "asc",
      },
      select: {
        buyerName: true,
      },
    }),
    prisma.cultureCycle.findMany({
      where:
        user.role === "SUPER_ADMIN" || !user.farmId
          ? {}
          : { farmId: user.farmId },
      orderBy: [{ status: "asc" }, { startDate: "desc" }, { cycleName: "asc" }],
      select: {
        cycleName: true,
        id: true,
      },
    }),
  ])

  const serializedTransactions = transactions.map((transaction) => ({
    buyerName: transaction.buyerName,
    createdAt: transaction.createdAt,
    cultureCycle: transaction.cultureCycle,
    cultureCycleId: transaction.cultureCycleId,
    dueDate: transaction.dueDate,
    grossAmount: decimalToNumber(transaction.grossAmount) ?? 0,
    harvestDate: transaction.harvestDate,
    harvestedCount: transaction.harvestedCount,
    id: transaction.id,
    invoiceNumber: transaction.invoiceNumber,
    notes: transaction.notes,
    paymentStatus: transaction.paymentStatus,
    pricePerKg: decimalToNumber(transaction.pricePerKg) ?? 0,
    totalWeightKg: transaction.totalWeightKg,
    updatedAt: transaction.updatedAt,
  }))

  return {
    buyerOptions: buyers.map((buyer) => buyer.buyerName),
    cycleOptions: cycles.map((cycle) => ({
      label: cycle.cycleName,
      value: cycle.id,
    })),
    filters,
    totalRevenue: serializedTransactions.reduce(
      (sum, transaction) => sum + transaction.grossAmount,
      0
    ),
    totalTransactions: serializedTransactions.length,
    totalWeightKg: serializedTransactions.reduce(
      (sum, transaction) => sum + transaction.totalWeightKg,
      0
    ),
    transactions: serializedTransactions,
  }
}

function readFilters(params: { [key: string]: string | string[] | undefined }): TransactionFilters {
  return {
    buyer: readSingleValue(params.buyer),
    period: readPeriod(readSingleValue(params.period)),
    query: readSingleValue(params.query),
    status: readStatus(readSingleValue(params.status)),
  }
}

function readSingleValue(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? ""
}

function readPeriod(value: string) {
  if (value === "7d" || value === "30d" || value === "90d" || value === "ytd" || value === "all") {
    return value
  }

  return "30d"
}

function readStatus(value: string) {
  if (
    value === "paid" ||
    value === "unpaid" ||
    value === "upcoming" ||
    value === "partial" ||
    value === "all"
  ) {
    return value
  }

  return "all"
}

function readPeriodWhere(period: string): Prisma.HarvestTransactionWhereInput {
  const now = new Date()

  if (period === "all") {
    return {}
  }

  if (period === "ytd") {
    return {
      harvestDate: {
        gte: new Date(now.getFullYear(), 0, 1),
      },
    }
  }

  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - days)

  return {
    harvestDate: {
      gte: startDate,
    },
  }
}

function readStatusWhere(status: string): Prisma.HarvestTransactionWhereInput {
  const today = startOfDay(new Date())

  if (status === "paid") {
    return {
      paymentStatus: HarvestPaymentStatus.PAID,
    }
  }

  if (status === "partial") {
    return {
      paymentStatus: HarvestPaymentStatus.PARTIALLY_PAID,
    }
  }

  if (status === "upcoming") {
    return {
      dueDate: {
        gte: today,
      },
      paymentStatus: HarvestPaymentStatus.UNPAID,
    }
  }

  if (status === "unpaid") {
    return {
      paymentStatus: HarvestPaymentStatus.UNPAID,
      OR: [
        { dueDate: null },
        {
          dueDate: {
            lt: today,
          },
        },
      ],
    }
  }

  return {}
}

function startOfDay(value: Date) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}
