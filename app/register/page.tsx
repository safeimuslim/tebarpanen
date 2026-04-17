import Link from "next/link"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Building2, KeyRound, Mail, MapPin, Phone } from "lucide-react"

import { auth } from "@/auth"
import { hashPassword } from "@/app/lib/password"
import { prisma } from "@/app/lib/prisma"
import { AuthShell } from "@/components/auth/auth-shell"
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
    required: "Nama farm, email, HP, dan password wajib diisi.",
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
    const email = readText(formData, "email").toLowerCase()
    const phone = readText(formData, "phone")
    const password = readText(formData, "password")
    const confirmPassword = readText(formData, "confirmPassword")

    if (!farmName || !email || !phone || !password) {
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
            name: farmName,
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
    <AuthShell
      badge="Mulai dengan Tebar Panen"
      description="Buat akun usaha budidaya ikan Anda dan mulai dari kolam yang sedang aktif hari ini."
      highlights={[
        "Catat kolam, panen, dan penjualan lebih rapi",
        "Mulai dari satu kolam dulu, lalu lanjut bertahap",
        "Laporan usaha lebih mudah dilihat saat dibutuhkan",
      ]}
      panelDescription="Buat akun usaha Anda untuk mulai merapikan pencatatan harian tanpa harus langsung mengubah semua proses yang sudah berjalan."
      panelTitle="Mulai lebih rapi dari sekarang"
      supportCopy="Tidak perlu menunggu semuanya siap. Anda bisa mulai dari data farm dan kolam yang paling sering dipakai, lalu melengkapinya sambil jalan."
      supportTitle="Mulai pelan-pelan juga tidak apa-apa"
      title="Daftarkan usaha budidaya Anda"
    >
      {message ? (
        <p
          className={
            message.tone === "success"
              ? "mb-4 rounded-xl border border-[#d9e9e4] bg-[#f7fbfa] px-4 py-3 text-sm text-[#355565]"
              : "bg-destructive/10 text-destructive mb-4 rounded-xl px-4 py-3 text-sm"
          }
        >
          {message.text}
        </p>
      ) : null}

      <form action={registerFarm} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-[#163042]" htmlFor="farmName">
              Nama Farm
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#7a909a]" />
              <input
                className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-xl border pr-3 pl-10 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                id="farmName"
                name="farmName"
                placeholder="Farm Lele Sejahtera"
                required
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label
              className="text-sm font-medium text-[#163042]"
              htmlFor="farmDescription"
            >
              Alamat Farm
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute top-3 left-3 size-4 text-[#7a909a]" />
              <textarea
                className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-xl border py-2 pr-3 pl-10 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                id="farmDescription"
                name="farmDescription"
                placeholder="Alamat farm"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-[#163042]" htmlFor="phone">
              HP
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#7a909a]" />
              <input
                className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-xl border pr-3 pl-10 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                id="phone"
                name="phone"
                placeholder="08xxxxxxxxxx"
                required
                type="tel"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-[#163042]" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#7a909a]" />
              <input
                className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-xl border pr-3 pl-10 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                id="email"
                name="email"
                placeholder="admin@farm.com"
                required
                type="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#163042]" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#7a909a]" />
              <input
                className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-xl border pr-3 pl-10 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                id="password"
                name="password"
                required
                type="password"
              />
            </div>
            <p className="text-xs leading-5 text-[#6f8792]">
              Minimal 6 karakter agar akun Anda lebih aman.
            </p>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-[#163042]"
              htmlFor="confirmPassword"
            >
              Konfirmasi Password
            </label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#7a909a]" />
              <input
                className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-xl border pr-3 pl-10 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                id="confirmPassword"
                name="confirmPassword"
                required
                type="password"
              />
            </div>
            <p className="text-xs leading-5 text-[#6f8792]">
              Ulangi password yang sama agar tidak salah saat masuk nanti.
            </p>
          </div>
        </div>

        <Button className="h-11 w-full rounded-xl" size="lg" type="submit">
          Daftarkan Farm
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-[#5b7483]">
        Sudah punya akun?{" "}
        <Link className="text-primary font-medium" href="/login">
          Masuk di sini
        </Link>
      </p>
    </AuthShell>
  );
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
