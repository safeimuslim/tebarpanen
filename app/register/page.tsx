import Link from "next/link"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { hashPassword } from "@/app/lib/password"
import { prisma } from "@/app/lib/prisma"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Registrasi Farm | Tebar Panen",
  description: "Daftarkan akun admin farm Tebar Panen",
}

type RegisterSearchParams = Promise<{
  status?: string
  error?: string
}>

function readText(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? ""
}

function getMessage(status?: string, error?: string) {
  if (status === "registered") {
    return {
      tone: "success" as const,
      text: "Registrasi berhasil. Silakan masuk dengan akun farm Anda.",
    }
  }

  if (!error) {
    return null
  }

  const messages: Record<string, string> = {
    required: "Nama farm, nama admin, email, HP, dan password wajib diisi.",
    password_length: "Password minimal 6 karakter.",
    password_mismatch: "Konfirmasi password tidak sesuai.",
    duplicate: "Email atau nomor HP sudah digunakan.",
    database_not_ready:
      "Database belum mengikuti schema terbaru. Jalankan migration terlebih dahulu.",
    register_failed: "Registrasi gagal. Coba lagi.",
  }

  return {
    tone: "error" as const,
    text: messages[error] ?? messages.register_failed,
  }
}

function registerRedirect(params: Record<string, string>): never {
  const query = new URLSearchParams(params)

  redirect(`/register?${query.toString()}`)
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: RegisterSearchParams
}) {
  const session = await auth()

  if (session?.user) {
    redirect("/dashboard")
  }

  const params = await searchParams
  const message = getMessage(params.status, params.error)

  async function registerFarm(formData: FormData) {
    "use server"

    const farmName = readText(formData, "farmName")
    const farmDescription = readText(formData, "farmDescription")
    const name = readText(formData, "name")
    const email = readText(formData, "email").toLowerCase()
    const phone = readText(formData, "phone")
    const password = readText(formData, "password")
    const confirmPassword = readText(formData, "confirmPassword")

    if (!farmName || !name || !email || !phone || !password) {
      return registerRedirect({ error: "required" })
    }

    if (password.length < 6) {
      return registerRedirect({ error: "password_length" })
    }

    if (password !== confirmPassword) {
      return registerRedirect({ error: "password_mismatch" })
    }

    try {
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name,
            email,
            phone,
            passwordHash: hashPassword(password),
            role: "FARM_ADMIN",
          },
        })

        const farm = await tx.farm.create({
          data: {
            name: farmName,
            description: farmDescription || null,
            managerId: user.id,
          },
        })

        await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            farmId: farm.id,
          },
        })
      })
    } catch (error) {
      if (isPrismaUniqueError(error)) {
        return registerRedirect({ error: "duplicate" })
      }

      if (isPrismaSchemaError(error)) {
        return registerRedirect({ error: "database_not_ready" })
      }

      return registerRedirect({ error: "register_failed" })
    }

    redirect("/login?registered=1")
  }

  return (
    <main className="bg-background text-foreground flex min-h-screen items-center justify-center px-4 py-10">
      <section className="border-border bg-card text-card-foreground w-full max-w-xl rounded-lg border p-6 shadow-sm">
        <div className="mb-6 space-y-2">
          <p className="text-muted-foreground text-sm">Tebar Panen</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Registrasi Farm
          </h1>
          <p className="text-muted-foreground text-sm">
            Buat akun admin farm untuk mulai mengelola kolam, alat, dan pekerja.
          </p>
        </div>

        {message ? (
          <p
            className={
              message.tone === "success"
                ? "border-border bg-muted text-foreground mb-4 rounded-md border px-3 py-2 text-sm"
                : "bg-destructive/10 text-destructive mb-4 rounded-md px-3 py-2 text-sm"
            }
          >
            {message.text}
          </p>
        ) : null}

        <form action={registerFarm} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="farmName">
                Nama Farm
              </label>
              <input
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                id="farmName"
                name="farmName"
                placeholder="Farm Lele Sejahtera"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="farmDescription">
                Deskripsi Farm
              </label>
              <textarea
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                id="farmDescription"
                name="farmDescription"
                placeholder="Opsional"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Nama Admin Farm
              </label>
              <input
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                id="name"
                name="name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phone">
                HP
              </label>
              <input
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                id="phone"
                name="phone"
                placeholder="08xxxxxxxxxx"
                required
                type="tel"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                id="email"
                name="email"
                placeholder="admin@farm.com"
                required
                type="email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                id="password"
                name="password"
                required
                type="password"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="confirmPassword">
                Konfirmasi Password
              </label>
              <input
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                id="confirmPassword"
                name="confirmPassword"
                required
                type="password"
              />
            </div>
          </div>

          <Button className="w-full" size="lg" type="submit">
            Daftarkan Farm
          </Button>
        </form>

        <p className="text-muted-foreground mt-4 text-center text-sm">
          Sudah punya akun?{" "}
          <Link className="text-primary font-medium" href="/login">
            Masuk di sini
          </Link>
        </p>
      </section>
    </main>
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

function isPrismaSchemaError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error.code === "P2021" || error.code === "P2022")
  )
}
