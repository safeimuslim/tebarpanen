"use server"

import { revalidatePath } from "next/cache"

import { actionError, actionSuccess, type ActionState } from "@/app/lib/action-state"
import { requireSessionUser } from "@/app/lib/authz"
import { prisma } from "@/app/lib/prisma"

export async function deleteHarvestTransaction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireSessionUser()

  try {
    const transactionId = formData.get("id")?.toString().trim()

    if (!transactionId) {
      return actionError("ID transaksi panen tidak valid.")
    }

    const transaction = await prisma.harvestTransaction.findFirst({
      where: {
        id: transactionId,
        ...(user.role === "SUPER_ADMIN" || !user.farmId
          ? {}
          : { cultureCycle: { farmId: user.farmId } }),
      },
      select: {
        cultureCycleId: true,
        invoiceNumber: true,
      },
    })

    if (!transaction) {
      return actionError("Transaksi panen tidak ditemukan atau tidak dapat diakses.")
    }

    await prisma.harvestTransaction.delete({
      where: {
        id: transactionId,
      },
    })

    revalidatePath("/transaksi-panen")
    revalidatePath(`/siklus-budidaya/${transaction.cultureCycleId}`)
    revalidatePath("/keuangan")

    return actionSuccess(`Transaksi ${transaction.invoiceNumber} berhasil dihapus.`)
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      return actionError(error.message)
    }

    return actionError("Transaksi panen gagal dihapus.")
  }
}
