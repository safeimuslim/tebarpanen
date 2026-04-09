"use server"

import { revalidatePath } from "next/cache"

import {
  getFarmScopeWhere,
  requireFarmId,
  requireSessionUser,
} from "@/app/lib/authz"
import { PondShape, PondStatus, PondType } from "@/app/generated/prisma/enums"
import { actionError, actionSuccess, type ActionState } from "@/app/lib/action-state"
import { prisma } from "@/app/lib/prisma"

import {
  getActionErrorMessage,
  readEnum,
  readOptionalDate,
  readOptionalDecimal,
  readOptionalFloat,
  readOptionalInt,
  readOptionalString,
  readRequiredString,
  slugify,
} from "./utils"

export async function createPond(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const farmId = requireFarmId(user)
    const name = readRequiredString(formData, "name")
    const shape = readEnum(formData, "shape", PondShape)

    await prisma.pond.create({
      data: {
        farmId,
        name,
        code: await createUniquePondCode(name),
        type: readEnum(formData, "type", PondType),
        shape,
        status: readEnum(formData, "status", PondStatus),
        lengthM:
          shape === "RECTANGLE" ? readOptionalFloat(formData, "lengthM") : null,
        widthM:
          shape === "RECTANGLE" ? readOptionalFloat(formData, "widthM") : null,
        diameterM:
          shape === "CIRCLE" ? readOptionalFloat(formData, "diameterM") : null,
        depthM: readOptionalFloat(formData, "depthM"),
        capacity: readOptionalInt(formData, "capacity"),
        purchasePrice: readOptionalDecimal(formData, "purchasePrice"),
        installedAt: readOptionalDate(formData, "installedAt"),
        depreciationMonths: readOptionalInt(formData, "depreciationMonths"),
        notes: readOptionalString(formData, "notes"),
      },
    })

    revalidatePath("/kolam")
    return actionSuccess("Kolam berhasil ditambahkan.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function updatePond(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const shape = readEnum(formData, "shape", PondShape)
    const id = readRequiredString(formData, "id")
    const pond = await prisma.pond.findFirst({
      where: {
        ...getFarmScopeWhere(user),
        id,
      },
      select: {
        id: true,
      },
    })

    if (!pond) {
      return actionError("Kolam tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.pond.update({
      where: {
        id: pond.id,
      },
      data: {
        name: readRequiredString(formData, "name"),
        type: readEnum(formData, "type", PondType),
        shape,
        status: readEnum(formData, "status", PondStatus),
        lengthM:
          shape === "RECTANGLE" ? readOptionalFloat(formData, "lengthM") : null,
        widthM:
          shape === "RECTANGLE" ? readOptionalFloat(formData, "widthM") : null,
        diameterM:
          shape === "CIRCLE" ? readOptionalFloat(formData, "diameterM") : null,
        depthM: readOptionalFloat(formData, "depthM"),
        capacity: readOptionalInt(formData, "capacity"),
        purchasePrice: readOptionalDecimal(formData, "purchasePrice"),
        installedAt: readOptionalDate(formData, "installedAt"),
        depreciationMonths: readOptionalInt(formData, "depreciationMonths"),
        notes: readOptionalString(formData, "notes"),
      },
    })

    revalidatePath("/kolam")
    return actionSuccess("Kolam berhasil diperbarui.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function deletePond(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const id = readRequiredString(formData, "id")
    const pond = await prisma.pond.findFirst({
      where: {
        ...getFarmScopeWhere(user),
        id,
      },
      select: {
        id: true,
      },
    })

    if (!pond) {
      return actionError("Kolam tidak ditemukan atau tidak dapat diakses.")
    }

    const activeCycles = await prisma.cultureCycle.count({
      where: {
        ...getFarmScopeWhere(user),
        pondId: pond.id,
      },
    })

    if (activeCycles > 0) {
      return actionError(
        "Kolam tidak bisa dihapus karena masih dipakai di siklus budidaya."
      )
    }

    await prisma.pond.delete({
      where: {
        id: pond.id,
      },
    })

    revalidatePath("/kolam")
    return actionSuccess("Kolam berhasil dihapus.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

async function createUniquePondCode(name: string) {
  const baseCode = slugify(name) || "kolam"
  let code = baseCode
  let index = 2

  while (await prisma.pond.findUnique({ where: { code } })) {
    code = `${baseCode}-${index}`
    index += 1
  }

  return code
}
