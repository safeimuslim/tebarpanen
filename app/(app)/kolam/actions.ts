"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
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
  await requireAuthenticatedUser()

  try {
    const name = readRequiredString(formData, "name")
    const shape = readEnum(formData, "shape", PondShape)

    await prisma.pond.create({
      data: {
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
  await requireAuthenticatedUser()

  try {
    const shape = readEnum(formData, "shape", PondShape)

    await prisma.pond.update({
      where: {
        id: readRequiredString(formData, "id"),
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
  await requireAuthenticatedUser()

  try {
    const id = readRequiredString(formData, "id")
    const activeCycles = await prisma.cultureCycle.count({
      where: {
        pondId: id,
      },
    })

    if (activeCycles > 0) {
      return actionError(
        "Kolam tidak bisa dihapus karena masih dipakai di siklus budidaya."
      )
    }

    await prisma.pond.delete({
      where: {
        id,
      },
    })

    revalidatePath("/kolam")
    return actionSuccess("Kolam berhasil dihapus.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

async function requireAuthenticatedUser() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
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
