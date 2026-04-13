"use server"

import { revalidatePath } from "next/cache"

import { ExpenseCategory } from "@/app/generated/prisma/enums"
import { type Prisma } from "@/app/generated/prisma/client"
import { actionError, actionSuccess, type ActionState } from "@/app/lib/action-state"
import { getFarmScopeWhere, requireSessionUser } from "@/app/lib/authz"
import { prisma } from "@/app/lib/prisma"

import {
  getActionErrorMessage,
  readOptionalDecimal,
  readOptionalFloat,
  readRequiredDecimal,
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

export async function createExpenseLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const cycle = await requireAccessibleCycle(cycleId, user)

    await prisma.expenseLog.create({
      data: {
        cultureCycleId: cycle.id,
        logDate: readRequiredDate(formData, "logDate", "Tanggal"),
        category: readExpenseCategory(formData),
        title: readRequiredText(formData, "title", "Nama biaya"),
        amount: readRequiredDecimal(formData, "amount", "Nominal"),
        notes: readText(formData, "notes") || null,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data biaya berhasil ditambahkan.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function updateExpenseLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const expenseLogId = readRequiredText(formData, "id", "ID biaya")
    const cycle = await requireAccessibleCycle(cycleId, user)

    const expenseLog = await prisma.expenseLog.findFirst({
      where: {
        id: expenseLogId,
        cultureCycleId: cycle.id,
      },
      select: {
        id: true,
      },
    })

    if (!expenseLog) {
      return actionError("Data biaya tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.expenseLog.update({
      where: {
        id: expenseLog.id,
      },
      data: {
        logDate: readRequiredDate(formData, "logDate", "Tanggal"),
        category: readExpenseCategory(formData),
        title: readRequiredText(formData, "title", "Nama biaya"),
        amount: readRequiredDecimal(formData, "amount", "Nominal"),
        notes: readText(formData, "notes") || null,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data biaya berhasil diperbarui.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function deleteExpenseLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const expenseLogId = readRequiredText(formData, "id", "ID biaya")
    const cycle = await requireAccessibleCycle(cycleId, user)

    const expenseLog = await prisma.expenseLog.findFirst({
      where: {
        id: expenseLogId,
        cultureCycleId: cycle.id,
      },
      select: {
        id: true,
      },
    })

    if (!expenseLog) {
      return actionError("Data biaya tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.expenseLog.delete({
      where: {
        id: expenseLog.id,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data biaya berhasil dihapus.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function createHarvestLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const cycle = await requireAccessibleCycle(cycleId, user)

    await prisma.harvestLog.create({
      data: {
        cultureCycleId: cycle.id,
        logDate: readRequiredDate(formData, "logDate", "Tanggal panen"),
        totalWeightKg: readRequiredFloat(formData, "totalWeightKg", "Total berat panen"),
        harvestedCount: readRequiredInt(formData, "harvestedCount", "Jumlah ikan terpanen"),
        pricePerKg: readRequiredDecimal(formData, "pricePerKg", "Harga jual per kg"),
        buyer: readText(formData, "buyer") || null,
        notes: readText(formData, "notes") || null,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data panen berhasil ditambahkan.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function updateHarvestLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const harvestLogId = readRequiredText(formData, "id", "ID panen")
    const cycle = await requireAccessibleCycle(cycleId, user)

    const harvestLog = await prisma.harvestLog.findFirst({
      where: {
        id: harvestLogId,
        cultureCycleId: cycle.id,
      },
      select: {
        id: true,
      },
    })

    if (!harvestLog) {
      return actionError("Data panen tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.harvestLog.update({
      where: {
        id: harvestLog.id,
      },
      data: {
        logDate: readRequiredDate(formData, "logDate", "Tanggal panen"),
        totalWeightKg: readRequiredFloat(formData, "totalWeightKg", "Total berat panen"),
        harvestedCount: readRequiredInt(formData, "harvestedCount", "Jumlah ikan terpanen"),
        pricePerKg: readRequiredDecimal(formData, "pricePerKg", "Harga jual per kg"),
        buyer: readText(formData, "buyer") || null,
        notes: readText(formData, "notes") || null,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data panen berhasil diperbarui.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function deleteHarvestLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const harvestLogId = readRequiredText(formData, "id", "ID panen")
    const cycle = await requireAccessibleCycle(cycleId, user)

    const harvestLog = await prisma.harvestLog.findFirst({
      where: {
        id: harvestLogId,
        cultureCycleId: cycle.id,
      },
      select: {
        id: true,
      },
    })

    if (!harvestLog) {
      return actionError("Data panen tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.harvestLog.delete({
      where: {
        id: harvestLog.id,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data panen berhasil dihapus.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function createSamplingLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const cycle = await requireAccessibleCycle(cycleId, user)

    await prisma.samplingLog.create({
      data: {
        cultureCycleId: cycle.id,
        logDate: readRequiredDate(formData, "logDate", "Tanggal sampling"),
        sampleCount: readRequiredInt(formData, "sampleCount", "Jumlah sampel"),
        averageWeightG: readRequiredFloat(formData, "averageWeightG", "Berat rata-rata"),
        averageLengthCm: readRequiredFloat(formData, "averageLengthCm", "Panjang rata-rata"),
        notes: readText(formData, "notes") || null,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data sampling berhasil ditambahkan.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function updateSamplingLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const samplingLogId = readRequiredText(formData, "id", "ID sampling")
    const cycle = await requireAccessibleCycle(cycleId, user)

    const samplingLog = await prisma.samplingLog.findFirst({
      where: {
        id: samplingLogId,
        cultureCycleId: cycle.id,
      },
      select: {
        id: true,
      },
    })

    if (!samplingLog) {
      return actionError("Data sampling tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.samplingLog.update({
      where: {
        id: samplingLog.id,
      },
      data: {
        logDate: readRequiredDate(formData, "logDate", "Tanggal sampling"),
        sampleCount: readRequiredInt(formData, "sampleCount", "Jumlah sampel"),
        averageWeightG: readRequiredFloat(formData, "averageWeightG", "Berat rata-rata"),
        averageLengthCm: readRequiredFloat(formData, "averageLengthCm", "Panjang rata-rata"),
        notes: readText(formData, "notes") || null,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data sampling berhasil diperbarui.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function deleteSamplingLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const samplingLogId = readRequiredText(formData, "id", "ID sampling")
    const cycle = await requireAccessibleCycle(cycleId, user)

    const samplingLog = await prisma.samplingLog.findFirst({
      where: {
        id: samplingLogId,
        cultureCycleId: cycle.id,
      },
      select: {
        id: true,
      },
    })

    if (!samplingLog) {
      return actionError("Data sampling tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.samplingLog.delete({
      where: {
        id: samplingLog.id,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data sampling berhasil dihapus.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function createWaterQualityLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const cycle = await requireAccessibleCycle(cycleId, user)

    await prisma.waterQualityLog.create({
      data: {
        cultureCycleId: cycle.id,
        logDate: readRequiredDate(formData, "logDate", "Tanggal"),
        ph: readOptionalFloat(formData, "ph"),
        temperatureC: readOptionalFloat(formData, "temperatureC"),
        doMgL: readOptionalFloat(formData, "doMgL"),
        ammoniaMgL: readOptionalFloat(formData, "ammoniaMgL"),
        waterColor: readText(formData, "waterColor") || null,
        notes: readText(formData, "notes") || null,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data kualitas air berhasil ditambahkan.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function updateWaterQualityLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const waterQualityLogId = readRequiredText(formData, "id", "ID kualitas air")
    const cycle = await requireAccessibleCycle(cycleId, user)

    const waterQualityLog = await prisma.waterQualityLog.findFirst({
      where: {
        id: waterQualityLogId,
        cultureCycleId: cycle.id,
      },
      select: {
        id: true,
      },
    })

    if (!waterQualityLog) {
      return actionError("Data kualitas air tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.waterQualityLog.update({
      where: {
        id: waterQualityLog.id,
      },
      data: {
        logDate: readRequiredDate(formData, "logDate", "Tanggal"),
        ph: readOptionalFloat(formData, "ph"),
        temperatureC: readOptionalFloat(formData, "temperatureC"),
        doMgL: readOptionalFloat(formData, "doMgL"),
        ammoniaMgL: readOptionalFloat(formData, "ammoniaMgL"),
        waterColor: readText(formData, "waterColor") || null,
        notes: readText(formData, "notes") || null,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data kualitas air berhasil diperbarui.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function deleteWaterQualityLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const waterQualityLogId = readRequiredText(formData, "id", "ID kualitas air")
    const cycle = await requireAccessibleCycle(cycleId, user)

    const waterQualityLog = await prisma.waterQualityLog.findFirst({
      where: {
        id: waterQualityLogId,
        cultureCycleId: cycle.id,
      },
      select: {
        id: true,
      },
    })

    if (!waterQualityLog) {
      return actionError("Data kualitas air tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.waterQualityLog.delete({
      where: {
        id: waterQualityLog.id,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data kualitas air berhasil dihapus.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function createTreatmentLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const cycle = await requireAccessibleCycle(cycleId, user)

    await prisma.treatmentLog.create({
      data: {
        cultureCycleId: cycle.id,
        logDate: readRequiredDate(formData, "logDate", "Tanggal"),
        productName: readRequiredText(formData, "productName", "Nama obat / vitamin"),
        dosage: readText(formData, "dosage") || null,
        purpose: readText(formData, "purpose") || null,
        notes: readText(formData, "notes") || null,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data pengobatan berhasil ditambahkan.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function updateTreatmentLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const treatmentLogId = readRequiredText(formData, "id", "ID pengobatan")
    const cycle = await requireAccessibleCycle(cycleId, user)

    const treatmentLog = await prisma.treatmentLog.findFirst({
      where: {
        id: treatmentLogId,
        cultureCycleId: cycle.id,
      },
      select: {
        id: true,
      },
    })

    if (!treatmentLog) {
      return actionError("Data pengobatan tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.treatmentLog.update({
      where: {
        id: treatmentLog.id,
      },
      data: {
        logDate: readRequiredDate(formData, "logDate", "Tanggal"),
        productName: readRequiredText(formData, "productName", "Nama obat / vitamin"),
        dosage: readText(formData, "dosage") || null,
        purpose: readText(formData, "purpose") || null,
        notes: readText(formData, "notes") || null,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data pengobatan berhasil diperbarui.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function deleteTreatmentLog(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const cycleId = readRequiredText(formData, "cycleId", "ID siklus")
    const treatmentLogId = readRequiredText(formData, "id", "ID pengobatan")
    const cycle = await requireAccessibleCycle(cycleId, user)

    const treatmentLog = await prisma.treatmentLog.findFirst({
      where: {
        id: treatmentLogId,
        cultureCycleId: cycle.id,
      },
      select: {
        id: true,
      },
    })

    if (!treatmentLog) {
      return actionError("Data pengobatan tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.treatmentLog.delete({
      where: {
        id: treatmentLog.id,
      },
    })

    revalidatePath(`/siklus-budidaya/${cycle.id}`)
    return actionSuccess("Data pengobatan berhasil dihapus.")
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

function readExpenseCategory(formData: FormData): ExpenseCategory {
  const value = readRequiredText(formData, "category", "Kategori biaya")

  if (
    value === ExpenseCategory.SEED ||
    value === ExpenseCategory.FEED ||
    value === ExpenseCategory.MEDICINE_VITAMIN ||
    value === ExpenseCategory.LABOR ||
    value === ExpenseCategory.ELECTRICITY ||
    value === ExpenseCategory.OTHER
  ) {
    return value
  }

  throw new Error("Kategori biaya tidak valid.")
}
