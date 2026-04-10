"use server"

import { revalidatePath } from "next/cache"

import { type Prisma } from "@/app/generated/prisma/client"
import { actionError, actionSuccess, type ActionState } from "@/app/lib/action-state"
import { getFarmScopeWhere, requireSessionUser } from "@/app/lib/authz"
import { prisma } from "@/app/lib/prisma"

import {
  getActionErrorMessage,
  readOptionalDecimal,
  readRequiredDate,
  readRequiredFloat,
  readRequiredInt,
  readRequiredText,
  readText,
} from "../utils"

export async function createFeedLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const cycle = await requireAccessibleCycle(cycleId, user)

    await prisma.feedLog.create({
      data: {
        cultureCycleId: cycle.id,
        feedName: readRequiredText(formData, "feedName", "Jenis pakan"),
        logDate: readRequiredDate(formData, "logDate", "Tanggal"),
        quantityKg: readRequiredFloat(formData, "quantityKg", "Berat pakan"),
        priceTotal: readOptionalDecimal(formData, "priceTotal"),
        notes: readText(formData, "notes") || null,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data pakan berhasil ditambahkan.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function updateFeedLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const feedLogId = readRequiredText(formData, "id", "ID pakan")
    const cycle = await requireAccessibleCycle(cycleId, user)

    const feedLog = await prisma.feedLog.findFirst({
      where: {
        id: feedLogId,
        cultureCycleId: cycle.id,
      },
      select: {
        id: true,
      },
    })

    if (!feedLog) {
      return actionError("Data pakan tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.feedLog.update({
      where: {
        id: feedLog.id,
      },
      data: {
        feedName: readRequiredText(formData, "feedName", "Jenis pakan"),
        logDate: readRequiredDate(formData, "logDate", "Tanggal"),
        quantityKg: readRequiredFloat(formData, "quantityKg", "Berat pakan"),
        priceTotal: readOptionalDecimal(formData, "priceTotal"),
        notes: readText(formData, "notes") || null,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data pakan berhasil diperbarui.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function deleteFeedLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const feedLogId = readRequiredText(formData, "id", "ID pakan")
    const cycle = await requireAccessibleCycle(cycleId, user)

    const feedLog = await prisma.feedLog.findFirst({
      where: {
        id: feedLogId,
        cultureCycleId: cycle.id,
      },
      select: {
        id: true,
      },
    })

    if (!feedLog) {
      return actionError("Data pakan tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.feedLog.delete({
      where: {
        id: feedLog.id,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data pakan berhasil dihapus.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function createMortalityLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const cycle = await requireAccessibleCycle(cycleId, user)

    await prisma.mortalityLog.create({
      data: {
        cultureCycleId: cycle.id,
        logDate: readRequiredDate(formData, "logDate", "Tanggal"),
        deadCount: readRequiredInt(formData, "deadCount", "Jumlah ikan mati"),
        cause: readText(formData, "cause") || null,
        notes: readText(formData, "notes") || null,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data mortalitas berhasil ditambahkan.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function updateMortalityLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const mortalityLogId = readRequiredText(formData, "id", "ID mortalitas")
    const cycle = await requireAccessibleCycle(cycleId, user)

    const mortalityLog = await prisma.mortalityLog.findFirst({
      where: {
        id: mortalityLogId,
        cultureCycleId: cycle.id,
      },
      select: {
        id: true,
      },
    })

    if (!mortalityLog) {
      return actionError("Data mortalitas tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.mortalityLog.update({
      where: {
        id: mortalityLog.id,
      },
      data: {
        logDate: readRequiredDate(formData, "logDate", "Tanggal"),
        deadCount: readRequiredInt(formData, "deadCount", "Jumlah ikan mati"),
        cause: readText(formData, "cause") || null,
        notes: readText(formData, "notes") || null,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data mortalitas berhasil diperbarui.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function deleteMortalityLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const mortalityLogId = readRequiredText(formData, "id", "ID mortalitas")
    const cycle = await requireAccessibleCycle(cycleId, user)

    const mortalityLog = await prisma.mortalityLog.findFirst({
      where: {
        id: mortalityLogId,
        cultureCycleId: cycle.id,
      },
      select: {
        id: true,
      },
    })

    if (!mortalityLog) {
      return actionError("Data mortalitas tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.mortalityLog.delete({
      where: {
        id: mortalityLog.id,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data mortalitas berhasil dihapus.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

async function requireAccessibleCycle(
  cycleId: string,
  user: Awaited<ReturnType<typeof requireSessionUser>>
) {
  const cycle = await prisma.cultureCycle.findFirst({
    where: {
      id: cycleId,
      ...getFarmScopeWhere<Prisma.CultureCycleWhereInput>(user),
    },
    select: {
      id: true,
    },
  })

  if (!cycle) {
    throw new Error("Siklus budidaya tidak ditemukan atau tidak dapat diakses.")
  }

  return cycle
}
