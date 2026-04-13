import { type Prisma } from "@/app/generated/prisma/client"
import { getFarmScopeWhere, requireSessionUser } from "@/app/lib/authz"
import { prisma } from "@/app/lib/prisma"

type MonthPeriod = {
  endExclusive: Date
  label: string
  monthParam: string
  start: Date
}

type FinanceRange = {
  endMonthParam: string
  endRange: Date
  label: string
  monthCount: number
  months: MonthPeriod[]
  nextEndMonthParam: string
  nextStartMonthParam: string
  previousEndMonthParam: string
  previousStartMonthParam: string
  startMonthParam: string
  startRange: Date
}

export type FinanceTrendPoint = {
  depreciation: number
  label: string
  monthParam: string
  netProfit: number
  operationalCost: number
  revenue: number
}

export type FinanceReportRow = {
  depreciation: number
  label: string
  netProfit: number
  operationalCost: number
  revenue: number
}

export type FinancePageData = {
  activeCyclesCount: number
  endMonthParam: string
  equipmentDepreciation: number
  equipmentDepreciationAssetCount: number
  expenseCost: number
  farmLabel: string
  feedCost: number
  harvestCount: number
  monthCount: number
  netProfit: number
  nextEndMonthParam: string
  nextStartMonthParam: string
  operationalCost: number
  operationalProfit: number
  periodLabel: string
  pondDepreciation: number
  pondDepreciationAssetCount: number
  previousEndMonthParam: string
  previousStartMonthParam: string
  reportRows: FinanceReportRow[]
  revenue: number
  seedCost: number
  startMonthParam: string
  totalDepreciatedAssetCount: number
  totalDepreciation: number
  trendPoints: FinanceTrendPoint[]
}

export async function getFinancePageData(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
): Promise<FinancePageData> {
  const user = await requireSessionUser()
  const params = await searchParams
  const range = readFinanceRange(params.start, params.end)
  const cycleWhere = getFarmScopeWhere<Prisma.CultureCycleWhereInput>(user)
  const farmRelationWhere =
    user.role === "SUPER_ADMIN" || !user.farmId
      ? {}
      : { cultureCycle: { farmId: user.farmId } }
  const pondWhere = getFarmScopeWhere<Prisma.PondWhereInput>(user)
  const equipmentWhere = getFarmScopeWhere<Prisma.EquipmentWhereInput>(user)

  const [
    activeCyclesCount,
    harvestLogs,
    feedLogs,
    expenseLogs,
    seededCycles,
    ponds,
    equipment,
  ] = await Promise.all([
    prisma.cultureCycle.count({
      where: {
        ...cycleWhere,
        startDate: {
          lt: range.endRange,
        },
        OR: [
          { endDate: null },
          {
            endDate: {
              gte: range.startRange,
            },
          },
        ],
      },
    }),
    prisma.harvestLog.findMany({
      where: {
        ...farmRelationWhere,
        logDate: {
          gte: range.startRange,
          lt: range.endRange,
        },
      },
      select: {
        logDate: true,
        pricePerKg: true,
        totalWeightKg: true,
      },
    }),
    prisma.feedLog.findMany({
      where: {
        ...farmRelationWhere,
        logDate: {
          gte: range.startRange,
          lt: range.endRange,
        },
      },
      select: {
        logDate: true,
        priceTotal: true,
      },
    }),
    prisma.expenseLog.findMany({
      where: {
        ...farmRelationWhere,
        logDate: {
          gte: range.startRange,
          lt: range.endRange,
        },
      },
      select: {
        amount: true,
        logDate: true,
      },
    }),
    prisma.cultureCycle.findMany({
      where: {
        ...cycleWhere,
        startDate: {
          gte: range.startRange,
          lt: range.endRange,
        },
      },
      select: {
        seedPriceTotal: true,
        startDate: true,
      },
    }),
    prisma.pond.findMany({
      where: pondWhere,
      select: {
        createdAt: true,
        depreciationMonths: true,
        installedAt: true,
        purchasePrice: true,
      },
    }),
    prisma.equipment.findMany({
      where: equipmentWhere,
      select: {
        createdAt: true,
        depreciationMonths: true,
        purchasePrice: true,
        purchasedAt: true,
      },
    }),
  ])

  const monthlyMap = new Map(
    range.months.map((month) => [
      month.monthParam,
      {
        depreciation: 0,
        label: month.label,
        monthParam: month.monthParam,
        netProfit: 0,
        operationalCost: 0,
        revenue: 0,
        expenseCost: 0,
        feedCost: 0,
        seedCost: 0,
      },
    ])
  )

  harvestLogs.forEach((log) => {
    const monthKey = toMonthParam(log.logDate)
    const month = monthlyMap.get(monthKey)

    if (!month) {
      return
    }

    month.revenue += log.totalWeightKg * decimalToNumber(log.pricePerKg)
  })

  feedLogs.forEach((log) => {
    const monthKey = toMonthParam(log.logDate)
    const month = monthlyMap.get(monthKey)

    if (!month) {
      return
    }

    month.feedCost += decimalToNumber(log.priceTotal)
  })

  expenseLogs.forEach((log) => {
    const monthKey = toMonthParam(log.logDate)
    const month = monthlyMap.get(monthKey)

    if (!month) {
      return
    }

    month.expenseCost += decimalToNumber(log.amount)
  })

  seededCycles.forEach((cycle) => {
    const monthKey = toMonthParam(cycle.startDate)
    const month = monthlyMap.get(monthKey)

    if (!month) {
      return
    }

    month.seedCost += decimalToNumber(cycle.seedPriceTotal)
  })

  const pondDepreciationAssetCount = applyDepreciationToMonths({
    assets: ponds.map((pond) => ({
      amount: decimalToNumber(pond.purchasePrice),
      depreciationMonths: pond.depreciationMonths,
      startDate: pond.installedAt ?? pond.createdAt,
    })),
    monthlyMap,
    months: range.months,
  })

  const equipmentDepreciationAssetCount = applyDepreciationToMonths({
    assets: equipment.map((item) => ({
      amount: decimalToNumber(item.purchasePrice),
      depreciationMonths: item.depreciationMonths,
      startDate: item.purchasedAt ?? item.createdAt,
    })),
    monthlyMap,
    months: range.months,
  })

  const trendPoints = Array.from(monthlyMap.values()).map((month) => {
    const operationalCost = month.seedCost + month.feedCost + month.expenseCost
    const netProfit = month.revenue - operationalCost - month.depreciation

    return {
      depreciation: month.depreciation,
      label: month.label,
      monthParam: month.monthParam,
      netProfit,
      operationalCost,
      revenue: month.revenue,
    }
  })

  const reportRows = trendPoints.map((point) => ({
    depreciation: point.depreciation,
    label: point.label,
    netProfit: point.netProfit,
    operationalCost: point.operationalCost,
    revenue: point.revenue,
  }))

  const revenue = sumNumbers(trendPoints.map((point) => point.revenue))
  const operationalCost = sumNumbers(trendPoints.map((point) => point.operationalCost))
  const totalDepreciation = sumNumbers(trendPoints.map((point) => point.depreciation))
  const seedCost = sumNumbers(Array.from(monthlyMap.values()).map((month) => month.seedCost))
  const feedCost = sumNumbers(Array.from(monthlyMap.values()).map((month) => month.feedCost))
  const expenseCost = sumNumbers(
    Array.from(monthlyMap.values()).map((month) => month.expenseCost)
  )
  const pondDepreciation = sumNumbers(
    trendPoints.map((point) => point.depreciation)
  ) - sumEquipmentDepreciation({
    equipment,
    months: range.months,
  })
  const equipmentDepreciation = sumEquipmentDepreciation({
    equipment,
    months: range.months,
  })
  const operationalProfit = revenue - operationalCost
  const netProfit = operationalProfit - totalDepreciation

  return {
    activeCyclesCount,
    endMonthParam: range.endMonthParam,
    equipmentDepreciation,
    equipmentDepreciationAssetCount,
    expenseCost,
    farmLabel: user.farmName ?? (user.farmId ? "Farm aktif" : "Semua farm"),
    feedCost,
    harvestCount: harvestLogs.length,
    monthCount: range.monthCount,
    netProfit,
    nextEndMonthParam: range.nextEndMonthParam,
    nextStartMonthParam: range.nextStartMonthParam,
    operationalCost,
    operationalProfit,
    periodLabel: range.label,
    pondDepreciation,
    pondDepreciationAssetCount,
    previousEndMonthParam: range.previousEndMonthParam,
    previousStartMonthParam: range.previousStartMonthParam,
    reportRows,
    revenue,
    seedCost,
    startMonthParam: range.startMonthParam,
    totalDepreciatedAssetCount:
      pondDepreciationAssetCount + equipmentDepreciationAssetCount,
    totalDepreciation,
    trendPoints,
  }
}

function readFinanceRange(
  startValue: string | string[] | undefined,
  endValue: string | string[] | undefined
): FinanceRange {
  const currentDate = new Date()
  const parsedStart = parseMonthParam(Array.isArray(startValue) ? startValue[0] : startValue)
  const parsedEnd = parseMonthParam(Array.isArray(endValue) ? endValue[0] : endValue)
  const fallback = {
    monthIndex: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  }
  const start = parsedStart ?? parsedEnd ?? fallback
  const end = parsedEnd ?? parsedStart ?? fallback
  const startIndex = start.year * 12 + start.monthIndex
  const endIndex = end.year * 12 + end.monthIndex
  const normalizedStartIndex = Math.min(startIndex, endIndex)
  const normalizedEndIndex = Math.max(startIndex, endIndex)
  const monthCount = normalizedEndIndex - normalizedStartIndex + 1
  const months: MonthPeriod[] = []

  for (let index = normalizedStartIndex; index <= normalizedEndIndex; index += 1) {
    const year = Math.floor(index / 12)
    const monthIndex = index % 12
    const startDate = new Date(Date.UTC(year, monthIndex, 1))
    months.push({
      endExclusive: new Date(Date.UTC(year, monthIndex + 1, 1)),
      label: new Intl.DateTimeFormat("id-ID", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(startDate),
      monthParam: formatMonthParam(year, monthIndex),
      start: startDate,
    })
  }

  const firstMonth = months[0]
  const lastMonth = months[months.length - 1]
  const previousStartIndex = normalizedStartIndex - monthCount
  const previousEndIndex = normalizedEndIndex - monthCount
  const nextStartIndex = normalizedStartIndex + monthCount
  const nextEndIndex = normalizedEndIndex + monthCount

  return {
    endMonthParam: lastMonth.monthParam,
    endRange: lastMonth.endExclusive,
    label:
      monthCount === 1
        ? new Intl.DateTimeFormat("id-ID", {
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          }).format(firstMonth.start)
        : `${new Intl.DateTimeFormat("id-ID", {
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          }).format(firstMonth.start)} - ${new Intl.DateTimeFormat("id-ID", {
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          }).format(lastMonth.start)}`,
    monthCount,
    months,
    nextEndMonthParam: formatMonthParam(Math.floor(nextEndIndex / 12), nextEndIndex % 12),
    nextStartMonthParam: formatMonthParam(Math.floor(nextStartIndex / 12), nextStartIndex % 12),
    previousEndMonthParam: formatMonthParam(
      Math.floor(previousEndIndex / 12),
      previousEndIndex % 12
    ),
    previousStartMonthParam: formatMonthParam(
      Math.floor(previousStartIndex / 12),
      previousStartIndex % 12
    ),
    startMonthParam: firstMonth.monthParam,
    startRange: firstMonth.start,
  }
}

function parseMonthParam(value?: string) {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) {
    return null
  }

  const [yearRaw, monthRaw] = value.split("-")
  const year = Number.parseInt(yearRaw, 10)
  const month = Number.parseInt(monthRaw, 10)

  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return null
  }

  return {
    monthIndex: month - 1,
    year,
  }
}

function formatMonthParam(year: number, monthIndex: number) {
  const date = new Date(Date.UTC(year, monthIndex, 1))
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`
}

function decimalToNumber(value?: Prisma.Decimal | number | null) {
  if (value == null) {
    return 0
  }

  return typeof value === "number" ? value : Number(value.toString())
}

function getMonthlyDepreciation({
  amount,
  depreciationMonths,
  periodStart,
  startDate,
}: {
  amount: number
  depreciationMonths?: number | null
  periodStart: Date
  startDate?: Date | null
}) {
  if (!amount || !depreciationMonths || depreciationMonths <= 0 || !startDate) {
    return 0
  }

  const assetMonthIndex = startDate.getUTCFullYear() * 12 + startDate.getUTCMonth()
  const periodMonthIndex = periodStart.getUTCFullYear() * 12 + periodStart.getUTCMonth()
  const monthOffset = periodMonthIndex - assetMonthIndex

  if (monthOffset < 0 || monthOffset >= depreciationMonths) {
    return 0
  }

  return amount / depreciationMonths
}

function applyDepreciationToMonths({
  assets,
  monthlyMap,
  months,
}: {
  assets: Array<{
    amount: number
    depreciationMonths?: number | null
    startDate?: Date | null
  }>
  monthlyMap: Map<
    string,
    {
      depreciation: number
      expenseCost: number
      feedCost: number
      label: string
      monthParam: string
      netProfit: number
      operationalCost: number
      revenue: number
      seedCost: number
    }
  >
  months: MonthPeriod[]
}) {
  let assetCount = 0

  assets.forEach((asset) => {
    let assetUsedInRange = false

    months.forEach((month) => {
      const depreciation = getMonthlyDepreciation({
        amount: asset.amount,
        depreciationMonths: asset.depreciationMonths,
        periodStart: month.start,
        startDate: asset.startDate,
      })

      if (!depreciation) {
        return
      }

      const currentMonth = monthlyMap.get(month.monthParam)

      if (!currentMonth) {
        return
      }

      currentMonth.depreciation += depreciation
      assetUsedInRange = true
    })

    if (assetUsedInRange) {
      assetCount += 1
    }
  })

  return assetCount
}

function sumEquipmentDepreciation({
  equipment,
  months,
}: {
  equipment: Array<{
    createdAt: Date
    depreciationMonths: number | null
    purchasePrice: Prisma.Decimal | null
    purchasedAt: Date | null
  }>
  months: MonthPeriod[]
}) {
  return equipment.reduce((total, item) => {
    return (
      total +
      months.reduce((monthTotal, month) => {
        return (
          monthTotal +
          getMonthlyDepreciation({
            amount: decimalToNumber(item.purchasePrice),
            depreciationMonths: item.depreciationMonths,
            periodStart: month.start,
            startDate: item.purchasedAt ?? item.createdAt,
          })
        )
      }, 0)
    )
  }, 0)
}

function toMonthParam(value: Date) {
  return formatMonthParam(value.getUTCFullYear(), value.getUTCMonth())
}

function sumNumbers(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0)
}
