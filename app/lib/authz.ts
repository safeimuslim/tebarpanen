import { redirect } from "next/navigation"

import { auth } from "@/auth"

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

export async function requireSessionUser(): Promise<SessionAppUser> {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  return session.user
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
  if (isSuperAdmin(user) || !user.farmId) {
    return {} as T
  }

  return { [fieldName]: user.farmId } as T
}

export function requireFarmAdmin(user: Pick<SessionAppUser, "role" | "farmId">) {
  if (user.role !== "FARM_ADMIN") {
    throw new Error("Hanya admin farm yang dapat melakukan aksi ini.")
  }

  return requireFarmId(user)
}
