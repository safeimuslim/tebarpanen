"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
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
  await requireAuthenticatedUser()

  try {
    await prisma.equipment.create({
      data: readEquipmentFormData(formData),
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
  await requireAuthenticatedUser()

  try {
    await prisma.equipment.update({
      where: {
        id: readRequiredString(formData, "id"),
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
  await requireAuthenticatedUser()

  try {
    await prisma.equipment.delete({
      where: {
        id: readRequiredString(formData, "id"),
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

async function requireAuthenticatedUser() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }
}
