"use server"

import { revalidatePath } from "next/cache"

import {
  getFarmScopeWhere,
  requireFarmId,
  requireSessionUser,
} from "@/app/lib/authz"
import {
  EquipmentCondition,
  EquipmentType,
} from "@/app/generated/prisma/enums"
import { actionError, actionSuccess, type ActionState } from "@/app/lib/action-state"
import { prisma } from "@/app/lib/prisma"

import {
  getActionErrorMessage,
  readEnum,
  readOptionalDate,
  readOptionalDecimal,
  readOptionalInt,
  readOptionalString,
  readRequiredInt,
  readRequiredString,
} from "./utils"

export async function createEquipment(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    await prisma.equipment.create({
      data: {
        farmId: requireFarmId(user),
        ...readEquipmentFormData(formData),
      },
    })

    revalidatePath("/alat")
    return actionSuccess("Alat berhasil ditambahkan.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function updateEquipment(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const id = readRequiredString(formData, "id")
    const equipment = await prisma.equipment.findFirst({
      where: {
        ...getFarmScopeWhere(user),
        id,
      },
      select: {
        id: true,
      },
    })

    if (!equipment) {
      return actionError("Alat tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.equipment.update({
      where: {
        id: equipment.id,
      },
      data: readEquipmentFormData(formData),
    })

    revalidatePath("/alat")
    return actionSuccess("Alat berhasil diperbarui.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function deleteEquipment(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const id = readRequiredString(formData, "id")
    const equipment = await prisma.equipment.findFirst({
      where: {
        ...getFarmScopeWhere(user),
        id,
      },
      select: {
        id: true,
      },
    })

    if (!equipment) {
      return actionError("Alat tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.equipment.delete({
      where: {
        id: equipment.id,
      },
    })

    revalidatePath("/alat")
    return actionSuccess("Alat berhasil dihapus.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

function readEquipmentFormData(formData: FormData) {
  return {
    name: readRequiredString(formData, "name"),
    type: readEnum(formData, "type", EquipmentType),
    quantity: readRequiredInt(formData, "quantity"),
    brand: readOptionalString(formData, "brand"),
    serialNumber: readOptionalString(formData, "serialNumber"),
    calibrationDate: readOptionalDate(formData, "calibrationDate"),
    condition: readEnum(formData, "condition", EquipmentCondition),
    purchasePrice: readOptionalDecimal(formData, "purchasePrice"),
    purchasedAt: readOptionalDate(formData, "purchasedAt"),
    depreciationMonths: readOptionalInt(formData, "depreciationMonths"),
    notes: readOptionalString(formData, "notes"),
  }
}
