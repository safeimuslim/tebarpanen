import { requireSessionUser } from "@/app/lib/authz"
import { prisma } from "@/app/lib/prisma"

import { ACTIVE_CYCLE_STATUS } from "../siklus-budidaya/constants"

type DashboardAlert = {
  cycleId?: string
  cycleName?: string
  description: string
  label: string
  tone: "danger" | "default" | "warning"
  type: "feed" | "harvest" | "mortality" | "water-quality"
}

type DashboardCycle = {
  ageDays: number
  aliveEstimate: number
  feedTodayKg: number
  href: string
  id: string
  name: string
  pondsLabel: string
  targetHarvestDate: Date | null
}

type DashboardNearestHarvest = {
  cycleName: string
  daysLeft: number
  href: string
  pondsLabel: string
  targetHarvestDate: Date
} | null

export type DashboardPageData = {
  activeCycles: DashboardCycle[]
  activeCyclesCount: number
  activePondsCount: number
  alerts: DashboardAlert[]
  farmLabel: string
  feedTodayKg: number
  mortalityTodayCount: number
  nearestHarvest: DashboardNearestHarvest
  nearestHarvestDaysLeft: number | null
  nearestHarvestLabel: string
  totalEstimatedAlive: number
}

export async function getDashboardPageData(): Promise<DashboardPageData> {
  const user = await requireSessionUser()
  const farmWhere =
    user.role === "SUPER_ADMIN" || !user.farmId ? {} : { farmId: user.farmId }
  const todayRange = getJakartaDayRange(new Date())

  const [activePondsCount, cycles] = await Promise.all([
    prisma.pond.count({
      where: {
        ...farmWhere,
        status: "ACTIVE",
      },
    }),
    prisma.cultureCycle.findMany({
      where: {
        ...farmWhere,
        status: ACTIVE_CYCLE_STATUS,
      },
      include: {
        ponds: {
          include: {
            pond: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        feedLogs: {
          select: {
            quantityKg: true,
          },
          where: {
            logDate: {
              gte: todayRange.start,
              lt: todayRange.endExclusive,
            },
          },
        },
        mortalityLogs: {
          select: {
            deadCount: true,
            logDate: true,
          },
        },
        waterQualityLogs: {
          select: {
            id: true,
          },
          where: {
            logDate: {
              gte: todayRange.start,
              lt: todayRange.endExclusive,
            },
          },
        },
      },
      orderBy: [
        { targetHarvestDate: "asc" },
        { startDate: "asc" },
      ],
    }),
  ])

  const serializedCycles = cycles.map((cycle) => {
    const totalDeadCount = cycle.mortalityLogs.reduce((sum, log) => sum + log.deadCount, 0)
    const todayDeadCount = cycle.mortalityLogs.reduce((sum, log) => {
      return isDateInRange(log.logDate, todayRange.start, todayRange.endExclusive)
        ? sum + log.deadCount
        : sum
    }, 0)
    const feedTodayKg = cycle.feedLogs.reduce((sum, log) => sum + log.quantityKg, 0)
    const pondsLabel = cycle.ponds.length
      ? cycle.ponds.map((item) => item.pond.name).join(", ")
      : "Belum ada kolam"

    return {
      ageDays: getDateDiffInDays(cycle.startDate, todayRange.now),
      aliveEstimate: Math.max(cycle.seedCount - totalDeadCount, 0),
      feedTodayKg,
      href: `/siklus-budidaya/${cycle.id}`,
      id: cycle.id,
      name: cycle.cycleName,
      pondsLabel,
      targetHarvestDate: cycle.targetHarvestDate,
      todayDeadCount,
      waterQualityLoggedToday: cycle.waterQualityLogs.length > 0,
    }
  })

  const totalEstimatedAlive = serializedCycles.reduce(
    (sum, cycle) => sum + cycle.aliveEstimate,
    0
  )
  const feedTodayKg = serializedCycles.reduce((sum, cycle) => sum + cycle.feedTodayKg, 0)
  const mortalityTodayCount = serializedCycles.reduce(
    (sum, cycle) => sum + cycle.todayDeadCount,
    0
  )
  const nearestHarvestCycle = serializedCycles.find((cycle) => {
    return cycle.targetHarvestDate && cycle.targetHarvestDate >= todayRange.start
  })
  const nearestHarvestDaysLeft = nearestHarvestCycle?.targetHarvestDate
    ? getDateDiffInDays(todayRange.now, nearestHarvestCycle.targetHarvestDate)
    : null
  const nearestHarvest =
    nearestHarvestCycle?.targetHarvestDate && nearestHarvestDaysLeft != null
      ? {
          cycleName: nearestHarvestCycle.name,
          daysLeft: nearestHarvestDaysLeft,
          href: nearestHarvestCycle.href,
          pondsLabel: nearestHarvestCycle.pondsLabel,
          targetHarvestDate: nearestHarvestCycle.targetHarvestDate,
        }
      : null

  return {
    activeCycles: serializedCycles.map((cycle) => ({
      ageDays: cycle.ageDays,
      aliveEstimate: cycle.aliveEstimate,
      feedTodayKg: cycle.feedTodayKg,
      href: cycle.href,
      id: cycle.id,
      name: cycle.name,
      pondsLabel: cycle.pondsLabel,
      targetHarvestDate: cycle.targetHarvestDate,
    })),
    activeCyclesCount: serializedCycles.length,
    activePondsCount,
    alerts: buildAlerts(serializedCycles, nearestHarvestDaysLeft),
    farmLabel: user.farmName ?? (user.farmId ? "Farm aktif" : "Semua farm"),
    feedTodayKg,
    mortalityTodayCount,
    nearestHarvest,
    nearestHarvestDaysLeft,
    nearestHarvestLabel: nearestHarvestCycle?.targetHarvestDate
      ? formatDate(nearestHarvestCycle.targetHarvestDate)
      : "-",
    totalEstimatedAlive,
  }
}

function buildAlerts(
  cycles: Array<{
    ageDays: number
    feedTodayKg: number
    href: string
    id: string
    name: string
    pondsLabel: string
    targetHarvestDate: Date | null
    todayDeadCount: number
    waterQualityLoggedToday: boolean
  }>,
  nearestHarvestDaysLeft: number | null
): DashboardAlert[] {
  const alerts: DashboardAlert[] = []

  const cyclesWithoutFeed = cycles.filter((cycle) => cycle.feedTodayKg <= 0).slice(0, 2)
  cyclesWithoutFeed.forEach((cycle) => {
    alerts.push({
      cycleId: cycle.id,
      cycleName: cycle.name,
      description: `${cycle.name} belum ada catatan pakan hari ini.`,
      label: "Pakan belum dicatat",
      tone: "warning",
      type: "feed",
    })
  })

  const cyclesWithoutWaterQuality = cycles
    .filter((cycle) => !cycle.waterQualityLoggedToday)
    .slice(0, 2)
  cyclesWithoutWaterQuality.forEach((cycle) => {
    alerts.push({
      cycleId: cycle.id,
      cycleName: cycle.name,
      description: `${cycle.name} belum ada input kualitas air hari ini.`,
      label: "Perlu input kualitas air",
      tone: "warning",
      type: "water-quality",
    })
  })

  const highMortalityCycles = cycles.filter((cycle) => cycle.todayDeadCount > 0).slice(0, 2)
  highMortalityCycles.forEach((cycle) => {
    alerts.push({
      cycleId: cycle.id,
      cycleName: cycle.name,
      description: `${cycle.name} mencatat mortalitas ${formatNumber(cycle.todayDeadCount)} ekor hari ini.`,
      label: "Mortalitas tercatat hari ini",
      tone: "danger",
      type: "mortality",
    })
  })

  const nearestHarvestCycle = cycles.find(
    (cycle) => cycle.targetHarvestDate && cycle.targetHarvestDate >= new Date()
  )

  if (
    nearestHarvestCycle?.targetHarvestDate &&
    nearestHarvestDaysLeft != null &&
    nearestHarvestDaysLeft <= 7
  ) {
    alerts.push({
      cycleId: nearestHarvestCycle.id,
      cycleName: nearestHarvestCycle.name,
      description: `${nearestHarvestCycle.name} mendekati target panen pada ${formatDate(
        nearestHarvestCycle.targetHarvestDate
      )}.`,
      label: "Panen semakin dekat",
      tone: "default",
      type: "harvest",
    })
  }

  return alerts.slice(0, 6)
}

function getJakartaDayRange(now: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Jakarta",
    year: "numeric",
  })
  const parts = formatter.formatToParts(now)
  const year = Number(parts.find((part) => part.type === "year")?.value ?? "1970")
  const month = Number(parts.find((part) => part.type === "month")?.value ?? "1")
  const day = Number(parts.find((part) => part.type === "day")?.value ?? "1")
  const start = new Date(Date.UTC(year, month - 1, day, -7, 0, 0))
  const endExclusive = new Date(Date.UTC(year, month - 1, day + 1, -7, 0, 0))

  return {
    endExclusive,
    now,
    start,
  }
}

function isDateInRange(value: Date, start: Date, endExclusive: Date) {
  return value >= start && value < endExclusive
}

function getDateDiffInDays(start: Date, end: Date) {
  const diffMs = end.getTime() - start.getTime()
  return Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 0)
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value)
}
