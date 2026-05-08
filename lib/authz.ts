import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export type AppRole = "SUPER_ADMIN" | "FARM_ADMIN" | "WORKER"

export type SessionAppUser = {
  id: string
  name?: string | null
  email?: string | null
  phone?: string | null
  role: AppRole
  farmId?: string | null
  farmName?: string | null
  isActive: boolean
}

export async function getSessionUser(): Promise<SessionAppUser | null> {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      email: true,
      farm: {
        select: {
          name: true,
        },
      },
      farmId: true,
      id: true,
      isActive: true,
      name: true,
      phone: true,
      role: true,
    },
  })

  if (!user?.isActive) {
    return null
  }

  return {
    email: user.email,
    farmId: user.farmId,
    farmName: user.farm?.name ?? null,
    id: user.id,
    isActive: user.isActive,
    name: user.name,
    phone: user.phone,
    role: user.role,
  }
}

export async function requireSessionUser(): Promise<SessionAppUser> {
  const user = await getSessionUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

export function isSuperAdmin(user: Pick<SessionAppUser, "role">) {
  return user.role === "SUPER_ADMIN"
}

export function requireFarmId(user: Pick<SessionAppUser, "farmId">) {
  if (!user.farmId) {
    throw new Error("Akun belum terhubung ke farm.")
  }

  return user.farmId
}

export function getFarmScopeWhere<T extends object>(
  user: Pick<SessionAppUser, "role" | "farmId">,
  fieldName = "farmId"
) {
  if (isSuperAdmin(user)) {
    return {} as T
  }

  return { [fieldName]: requireFarmId(user) } as T
}

export function requireFarmAdmin(user: Pick<SessionAppUser, "role" | "farmId">) {
  if (user.role !== "FARM_ADMIN") {
    throw new Error("Hanya admin farm yang dapat melakukan aksi ini.")
  }

  return requireFarmId(user)
}
