import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { hashPassword, verifyPassword } from "@/app/lib/password"
import { prisma } from "@/app/lib/prisma"
import { Button } from "@/components/ui/button"

type ProfileSearchParams = Promise<{
  status?: string
  error?: string
}>

function readText(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? ""
}

function profileRedirect(params: Record<string, string>): never {
  const query = new URLSearchParams(params)

  redirect(`/profile?${query.toString()}`)
}

function getProfileMessage(status?: string, error?: string) {
  if (status === "updated") {
    return {
      tone: "success",
      text: "Profile berhasil diperbarui.",
    }
  }

  if (!error) {
    return null
  }

  const messages: Record<string, string> = {
    required: "Nama, email, dan nomor HP wajib diisi.",
    password_mismatch: "Konfirmasi password baru tidak sesuai.",
    current_password_required: "Password saat ini wajib diisi.",
    current_password_invalid: "Password saat ini tidak sesuai.",
    user_not_found: "User tidak ditemukan.",
    duplicate: "Email atau nomor HP sudah digunakan user lain.",
    update_failed: "Profile gagal diperbarui.",
  }

  return {
    tone: "error",
    text: messages[error] ?? messages.update_failed,
  }
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: ProfileSearchParams
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    redirect("/login")
  }

  const params = await searchParams
  const message = getProfileMessage(params.status, params.error)

  async function updateProfile(formData: FormData) {
    "use server"

    const session = await auth()

    if (!session?.user?.id) {
      redirect("/login")
    }

    const name = readText(formData, "name")
    const email = readText(formData, "email").toLowerCase()
    const phone = readText(formData, "phone")
    const currentPassword = readText(formData, "currentPassword")
    const newPassword = readText(formData, "newPassword")
    const confirmPassword = readText(formData, "confirmPassword")

    if (!name || !email || !phone) {
      return profileRedirect({ error: "required" })
    }

    if (newPassword && newPassword !== confirmPassword) {
      return profileRedirect({ error: "password_mismatch" })
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!currentUser) {
      return profileRedirect({ error: "user_not_found" })
    }

    const data: {
      name: string
      email: string
      phone: string
      passwordHash?: string
    } = {
      name,
      email,
      phone,
    }

    if (newPassword) {
      if (!currentPassword) {
        return profileRedirect({ error: "current_password_required" })
      }

      if (!verifyPassword(currentPassword, currentUser.passwordHash)) {
        return profileRedirect({ error: "current_password_invalid" })
      }

      data.passwordHash = hashPassword(newPassword)
    }

    try {
      await prisma.user.update({
        where: { id: currentUser.id },
        data,
      })
    } catch (error) {
      if (isPrismaUniqueError(error)) {
        return profileRedirect({ error: "duplicate" })
      }

      if (error instanceof AuthError) {
        throw error
      }

      return profileRedirect({ error: "update_failed" })
    }

    return profileRedirect({ status: "updated" })
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground text-sm">Akun</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Perbarui data akun dan password login.
        </p>
      </div>

      {message ? (
        <p
          className={
            message.tone === "success"
              ? "border-border bg-muted text-foreground rounded-md border px-3 py-2 text-sm"
              : "bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm"
          }
        >
          {message.text}
        </p>
      ) : null}

      <form
        action={updateProfile}
        className="border-border bg-card text-card-foreground max-w-2xl space-y-5 rounded-lg border p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Nama
            </label>
            <input
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue={user.name}
              id="name"
              name="name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue={user.email}
              id="email"
              name="email"
              type="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="phone">
              HP
            </label>
            <input
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue={user.phone ?? ""}
              id="phone"
              name="phone"
              type="tel"
              required
            />
          </div>
        </div>

        <div className="border-border space-y-4 border-t pt-5">
          <div>
            <h2 className="font-medium">Ubah Password</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Kosongkan bagian ini jika password tidak ingin diubah.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="currentPassword">
                Password Saat Ini
              </label>
              <input
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="newPassword">
                Password Baru
              </label>
              <input
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="confirmPassword">
                Konfirmasi Password
              </label>
              <input
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        <Button type="submit">Simpan Perubahan</Button>
      </form>
    </div>
  )
}

function isPrismaUniqueError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  )
}
