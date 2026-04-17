import Link from "next/link"
import type { Metadata } from "next"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import { KeyRound, Mail, Phone } from "lucide-react"

import { auth, signIn } from "@/auth"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Login | Tebar Panen",
  description: "Masuk ke akun Tebar Panen",
}

type LoginSearchParams = Promise<{
  callbackUrl?: string
  error?: string
  code?: string
  registered?: string
}>

function getSafeRedirectPath(value?: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard"
  }

  return value
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: LoginSearchParams
}) {
  const session = await auth()
  const params = await searchParams
  const callbackUrl = getSafeRedirectPath(params.callbackUrl)

  if (session?.user) {
    redirect(callbackUrl)
  }

  const loginFailed =
    params.error === "CredentialsSignin" || params.code === "credentials"
  const registrationSuccess = params.registered === "1"

  return (
    <AuthShell
      badge="Masuk ke Tebar Panen"
      description="Gunakan email atau nomor HP yang sudah terdaftar untuk melanjutkan pencatatan budidaya ikan Anda."
      highlights={[
        "Lanjutkan pencatatan kolam yang sedang aktif",
        "Pantau panen dan penjualan dari data terakhir",
        "Lihat kembali laporan usaha tanpa buka catatan terpisah",
      ]}
      panelDescription="Masuk kembali untuk melanjutkan operasional budidaya ikan Anda dari data yang terakhir dicatat."
      panelTitle="Selamat datang kembali"
      supportCopy="Saat Anda masuk kembali, data kolam, panen, dan penjualan terakhir tetap mudah ditemukan tanpa perlu membuka catatan lama satu per satu."
      supportTitle="Lanjutkan dari data terakhir"
      title="Masuk ke akun Anda"
    >
      {registrationSuccess ? (
        <p className="mb-4 rounded-xl border border-[#d9e9e4] bg-[#f7fbfa] px-4 py-3 text-sm text-[#355565]">
          Registrasi berhasil. Sekarang Anda bisa masuk dengan akun farm yang
          baru dibuat.
        </p>
      ) : null}

      {loginFailed ? (
        <p className="bg-destructive/10 text-destructive mb-4 rounded-xl px-4 py-3 text-sm">
          Email/HP atau password tidak sesuai.
        </p>
      ) : null}

      <form
        className="space-y-4"
        action={async (formData) => {
          "use server"

          const redirectTo = getSafeRedirectPath(
            formData.get("redirectTo")?.toString()
          )

          try {
            await signIn("credentials", {
              identifier: formData.get("identifier"),
              password: formData.get("password"),
              redirectTo,
            })
          } catch (error) {
            if (error instanceof AuthError) {
              redirect(
                `/login?error=CredentialsSignin&callbackUrl=${encodeURIComponent(
                  redirectTo
                )}`
              )
            }

            throw error
          }
        }}
      >
        <input name="redirectTo" type="hidden" value={callbackUrl} />

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#163042]" htmlFor="identifier">
            Email / HP
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center gap-1 text-[#7a909a]">
              <Mail className="size-4" />
              <Phone className="size-4" />
            </div>
            <input
              autoComplete="username"
              className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-xl border pr-3 pl-12 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
              id="identifier"
              name="identifier"
              placeholder="email@domain.com / 08xxxxxxxxxx"
              required
              type="text"
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
              autoComplete="current-password"
              className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-xl border pr-3 pl-10 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
              id="password"
              name="password"
              placeholder="Masukkan password"
              required
              type="password"
            />
          </div>
        </div>

        <Button className="mt-2 h-11 w-full rounded-xl" size="lg" type="submit">
          Masuk
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-[#5b7483]">
        Belum punya akun farm?{" "}
        <Link className="text-primary font-medium" href="/register">
          Daftarkan usaha di sini
        </Link>
      </p>
    </AuthShell>
  )
}
