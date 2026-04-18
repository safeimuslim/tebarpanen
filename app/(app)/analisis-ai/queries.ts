import { requireSessionUser } from "@/app/lib/authz"
import { prisma } from "@/app/lib/prisma"

import { getCycleById } from "../siklus-budidaya/queries"

export type AiAnalysisCycleOption = {
  id: string
  mortalityCount: number
  pondsLabel: string
  startDate: Date
  status: string
  targetHarvestDate: Date | null
  title: string
}

export async function getAiAnalysisPageData(selectedCycleId?: string) {
  const user = await requireSessionUser()
  const cycleWhere =
    user.role === "SUPER_ADMIN" || !user.farmId
      ? { status: "ACTIVE" as const }
      : { farmId: user.farmId, status: "ACTIVE" as const }

  const cycles = await prisma.cultureCycle.findMany({
    where: cycleWhere,
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
      mortalityLogs: {
        select: {
          deadCount: true,
        },
      },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  })

  const options: AiAnalysisCycleOption[] = cycles.map((cycle) => ({
    id: cycle.id,
    mortalityCount: cycle.mortalityLogs.reduce((sum, log) => sum + log.deadCount, 0),
    pondsLabel: cycle.ponds.length
      ? cycle.ponds.map((item) => item.pond.name).join(", ")
      : "Belum ada kolam",
    startDate: cycle.startDate,
    status: cycle.status,
    targetHarvestDate: cycle.targetHarvestDate,
    title: cycle.cycleName,
  }))

  const resolvedCycleId = options.some((cycle) => cycle.id === selectedCycleId)
    ? selectedCycleId
    : null

  const selectedCycle = resolvedCycleId ? await getCycleById(resolvedCycleId) : null

  return {
    cycles: options.map((cycle) => ({
      ...cycle,
      // Keep query data JSON-safe if later passed to client components.
      mortalityCount: cycle.mortalityCount,
    })),
    selectedCycle,
    selectedCycleId: resolvedCycleId ?? null,
  }
}
