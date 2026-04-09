"use server"

import { revalidatePath } from "next/cache"

import { actionError, actionSuccess, type ActionState } from "@/app/lib/action-state"
import { requireFarmAdmin, requireSessionUser } from "@/app/lib/authz"
import { hashPassword } from "@/app/lib/password"
import { prisma } from "@/app/lib/prisma"

function readText(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? ""
}

function readIsActive(formData: FormData) {
  return readText(formData, "status") !== "INACTIVE"
}

export async function createWorker(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const farmId = requireFarmAdmin(user)
    const name = readText(formData, "name")
    const email = readText(formData, "email").toLowerCase()
    const phone = readText(formData, "phone")
    const password = readText(formData, "password")

    if (!name || !email || !phone || !password) {
      return actionError("Nama, email, HP, dan password wajib diisi.")
    }

    if (password.length < 6) {
      return actionError("Password minimal 6 karakter.")
    }

    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: hashPassword(password),
        role: "WORKER",
        farmId,
        createdById: user.id,
        isActive: readIsActive(formData),
      },
    })

    revalidatePath("/pengaturan/user")
    return actionSuccess("User pekerja berhasil ditambahkan.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function updateWorker(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const sessionUser = await requireSessionUser()

  try {
    const farmId = requireFarmAdmin(sessionUser)
    const id = readText(formData, "id")
    const name = readText(formData, "name")
    const email = readText(formData, "email").toLowerCase()
    const phone = readText(formData, "phone")
    const password = readText(formData, "password")

    if (!id || !name || !email || !phone) {
      return actionError("Nama, email, dan HP wajib diisi.")
    }

    if (password && password.length < 6) {
      return actionError("Password minimal 6 karakter.")
    }

    const worker = await prisma.user.findFirst({
      where: {
        id,
        farmId,
        role: "WORKER",
      },
      select: {
        id: true,
      },
    })

    if (!worker) {
      return actionError("User pekerja tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.user.update({
      where: {
        id: worker.id,
      },
      data: {
        name,
        email,
        phone,
        isActive: readIsActive(formData),
        ...(password ? { passwordHash: hashPassword(password) } : {}),
      },
    })

    revalidatePath("/pengaturan/user")
    return actionSuccess("User pekerja berhasil diperbarui.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

export async function deleteWorker(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const sessionUser = await requireSessionUser()

  try {
    const farmId = requireFarmAdmin(sessionUser)
    const id = readText(formData, "id")

    const worker = await prisma.user.findFirst({
      where: {
        id,
        farmId,
        role: "WORKER",
      },
      select: {
        id: true,
      },
    })

    if (!worker) {
      return actionError("User pekerja tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.user.delete({
      where: {
        id: worker.id,
      },
    })

    revalidatePath("/pengaturan/user")
    return actionSuccess("User pekerja berhasil dihapus.")
  } catch (error) {
    return actionError(getActionErrorMessage(error))
  }
}

function getActionErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    if (error.message === "Hanya admin farm yang dapat melakukan aksi ini.") {
      return error.message
    }

    if (error.message === "Akun belum terhubung ke farm.") {
      return error.message
    }
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  ) {
    return "Email atau nomor HP sudah digunakan user lain."
  }

  return "Aksi user gagal diproses."
}
