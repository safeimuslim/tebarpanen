import { requireSessionUser } from "@/app/lib/authz"
import { prisma } from "@/app/lib/prisma"

import { ACTIVE_CYCLE_STATUS } from "./constants"
import type {
  CycleDetailData,
  CycleFormPondOption,
  CyclePageData,
} from "./types"
import { decimalToNumber, getEstimatedAlive } from "./utils"

export async function getCyclePageData(): Promise<CyclePageData> {
  const user = await requireSessionUser()
  const cycleWhere =
    user.role === "SUPER_ADMIN" || !user.farmId ? {} : { farmId: user.farmId }

  const [cycles, availablePonds] = await Promise.all([
    prisma.cultureCycle.findMany({
      where: cycleWhere,
      include: {
        farm: true,
        ponds: {
          select: {
            pond: {
              select: {
                id: true,
                name: true,
                type: true,
                shape: true,
                status: true,
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
        },
        mortalityLogs: {
          select: {
            deadCount: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }, { cycleName: "asc" }],
    }),
    getSelectablePonds(),
  ])
  const serializedCycles = cycles.map((cycle) => ({
    ...cycle,
    ponds: cycle.ponds.map((item) => item.pond),
    seedPriceTotal: decimalToNumber(cycle.seedPriceTotal),
  }))

  const activeCycles = serializedCycles.filter(
    (cycle) => cycle.status === ACTIVE_CYCLE_STATUS
  )
  const totalEstimatedAlive = activeCycles.reduce((total, cycle) => {
    const deadCount = cycle.mortalityLogs.reduce((sum, log) => sum + log.deadCount, 0)
    return total + getEstimatedAlive(cycle.seedCount, deadCount)
  }, 0)

  return {
    activeCount: activeCycles.length,
    availablePonds,
    canManageCycles: user.role === "FARM_ADMIN",
    cycles: serializedCycles,
    totalEstimatedAlive,
    totalPondsUsed: new Set(
      activeCycles.flatMap((cycle) => cycle.ponds.map((pond) => pond.id))
    ).size,
  }
}

export async function getSelectablePonds(excludeCycleId?: string): Promise<CycleFormPondOption[]> {
  const user = await requireSessionUser()
  const pondWhere =
    user.role === "SUPER_ADMIN" || !user.farmId ? {} : { farmId: user.farmId }
  const activeCyclePondWhere = {
    isActive: true,
    cycle: {
      ...(user.role === "SUPER_ADMIN" || !user.farmId ? {} : { farmId: user.farmId }),
      status: ACTIVE_CYCLE_STATUS,
      ...(excludeCycleId ? { id: { not: excludeCycleId } } : {}),
    },
  }

  const activeCyclePonds = await prisma.cyclePond.findMany({
    where: activeCyclePondWhere,
    select: {
      pondId: true,
    },
  })

  return prisma.pond.findMany({
    where: {
      ...pondWhere,
      id: {
        notIn: activeCyclePonds.map((item) => item.pondId),
      },
    },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      type: true,
      shape: true,
      status: true,
    },
  })
}

export async function getCycleById(id: string): Promise<CycleDetailData | null> {
  const user = await requireSessionUser()

  return prisma.cultureCycle.findFirst({
    where: {
      id,
      ...(user.role === "SUPER_ADMIN" || !user.farmId ? {} : { farmId: user.farmId }),
    },
    include: {
      farm: true,
      ponds: {
        include: {
          pond: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      feedLogs: {
        orderBy: [
          { logDate: "desc" },
          { createdAt: "desc" },
        ],
      },
      mortalityLogs: {
        select: {
          deadCount: true,
        },
      },
    },
  })
}
