"use server"

import { revalidatePath } from "next/cache"

import { CycleStatus } from "@/app/generated/prisma/enums"
import { actionError, actionSuccess, type ActionState } from "@/app/lib/action-state"
import { requireFarmAdmin, requireSessionUser } from "@/app/lib/authz"
import { prisma } from "@/app/lib/prisma"

import { ACTIVE_CYCLE_STATUS } from "./constants"
import {
  getActionErrorMessage,
  readOptionalDate,
  readOptionalDecimal,
  readOptionalFloat,
  readRequiredDate,
  readRequiredIdList,
  readRequiredInt,
  readRequiredText,
  readText,
} from "./utils"

export async function createCycle(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const farmId = requireFarmAdmin(user)
    const pondIds = readRequiredIdList(formData, "pondIds", "Kolam")

    await ensurePondsAvailable(pondIds, farmId)

    await prisma.cultureCycle.create({
      data: {
        farmId,
        cycleName: readRequiredText(formData, "cycleName", "Nama siklus"),
        startDate: readRequiredDate(formData, "startDate", "Tanggal mulai"),
        seedCount: readRequiredInt(formData, "seedCount", "Jumlah bibit"),
        initialAvgWeightG: readOptionalFloat(formData, "initialAvgWeightG"),
        seedPriceTotal: readOptionalDecimal(formData, "seedPriceTotal"),
        targetHarvestDate: readOptionalDate(formData, "targetHarvestDate"),
        status: ACTIVE_CYCLE_STATUS,
        notes: readText(formData, "notes") || null,
        ponds: {
          create: pondIds.map((pondId) => ({
            pondId,
            isActive: true,
          })),
        },
      },
    })

    revalidatePath("/siklus-budidaya")
    return actionSuccess("Siklus budidaya berhasil ditambahkan.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function updateCycle(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const farmId = requireFarmAdmin(user)
    const id = readRequiredText(formData, "id", "ID siklus")
    const pondIds = readRequiredIdList(formData, "pondIds", "Kolam")
    const nextStatus = readRequiredCycleStatus(formData)

    const cycle = await prisma.cultureCycle.findFirst({
      where: {
        id,
        farmId,
      },
      select: {
        id: true,
      },
    })

    if (!cycle) {
      return actionError("Siklus budidaya tidak ditemukan atau tidak dapat diakses.")
    }

    await ensurePondsExist(pondIds, farmId)

    if (nextStatus === ACTIVE_CYCLE_STATUS) {
      await ensurePondsAvailable(pondIds, farmId, cycle.id)
    }

    await prisma.$transaction(async (tx) => {
      await tx.cultureCycle.update({
        where: {
          id: cycle.id,
        },
        data: {
          cycleName: readRequiredText(formData, "cycleName", "Nama siklus"),
          startDate: readRequiredDate(formData, "startDate", "Tanggal mulai"),
          seedCount: readRequiredInt(formData, "seedCount", "Jumlah bibit"),
          initialAvgWeightG: readOptionalFloat(formData, "initialAvgWeightG"),
          seedPriceTotal: readOptionalDecimal(formData, "seedPriceTotal"),
          targetHarvestDate: readOptionalDate(formData, "targetHarvestDate"),
          status: nextStatus,
          notes: readText(formData, "notes") || null,
        },
      })

      await tx.cyclePond.deleteMany({
        where: {
          cycleId: cycle.id,
        },
      })

      await tx.cyclePond.createMany({
        data: pondIds.map((pondId) => ({
          cycleId: cycle.id,
          pondId,
          isActive: nextStatus === ACTIVE_CYCLE_STATUS,
        })),
      })
    })

    revalidatePath("/siklus-budidaya")
    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Siklus budidaya berhasil diperbarui.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function deleteCycle(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const farmId = requireFarmAdmin(user)
    const id = readRequiredText(formData, "id", "ID siklus")

    const cycle = await prisma.cultureCycle.findFirst({
      where: {
        id,
        farmId,
      },
      select: {
        id: true,
      },
    })

    if (!cycle) {
      return actionError("Siklus budidaya tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.cultureCycle.delete({
      where: {
        id: cycle.id,
      },
    })

    revalidatePath("/siklus-budidaya")
    return actionSuccess("Siklus budidaya berhasil dihapus.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

async function ensurePondsExist(pondIds: string[], farmId: string) {
  const ponds = await prisma.pond.findMany({
    where: {
      id: {
        in: pondIds,
      },
      farmId,
    },
    select: {
      id: true,
      name: true,
    },
  })

  if (ponds.length !== pondIds.length) {
    throw new Error("Ada kolam yang tidak ditemukan atau tidak dapat diakses.")
  }

  return ponds
}

async function ensurePondsAvailable(pondIds: string[], farmId: string, excludeCycleId?: string) {
  await ensurePondsExist(pondIds, farmId)

  const activeCyclePonds = await prisma.cyclePond.findMany({
    where: {
      pondId: {
        in: pondIds,
      },
      isActive: true,
      cycle: {
        farmId,
        status: ACTIVE_CYCLE_STATUS,
        ...(excludeCycleId ? { id: { not: excludeCycleId } } : {}),
      },
    },
    select: {
      pond: {
        select: {
          name: true,
        },
      },
    },
  })

  if (activeCyclePonds.length > 0) {
    const pondNames = activeCyclePonds.map((item) => item.pond.name).join(", ")
    throw new Error(
      `Kolam berikut sedang dipakai dalam siklus aktif lain: ${pondNames}.`
    )
  }
}

function readRequiredCycleStatus(formData: FormData) {
  const value = readRequiredText(formData, "status", "Status")

  if (!Object.values(CycleStatus).includes(value as CycleStatus)) {
    throw new Error("Status siklus tidak valid.")
  }

  return value as CycleStatus
}
