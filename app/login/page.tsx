import type { Metadata } from "next"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

import { auth, signIn } from "@/auth"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Login | Tebar Panen",
  description: "Masuk ke akun Tebar Panen",
}

type LoginSearchParams = Promise<{
  callbackUrl?: string
  error?: string
  code?: string
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

  return (
    <main className="bg-background text-foreground flex min-h-screen items-center justify-center px-4 py-10">
      <section className="border-border bg-card text-card-foreground w-full max-w-sm rounded-lg border p-6 shadow-sm">
        <div className="mb-6 space-y-2">
          <p className="text-muted-foreground text-sm">Tebar Panen</p>
          <h1 className="text-2xl font-semibold tracking-tight">Masuk</h1>
          <p className="text-muted-foreground text-sm">
            Gunakan email atau nomor HP yang terdaftar.
          </p>
        </div>

        {loginFailed ? (
          <p className="bg-destructive/10 text-destructive mb-4 rounded-md px-3 py-2 text-sm">
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
            <label className="text-sm font-medium" htmlFor="identifier">
              Email / HP
            </label>
            <input
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
              id="identifier"
              name="identifier"
              placeholder="email@domain.com / 08xxxxxxxxxx"
              type="text"
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
              id="password"
              name="password"
              placeholder="Masukkan password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <Button className="mt-2 w-full" size="lg" type="submit">
            Masuk
          </Button>
        </form>
      </section>
    </main>
  )
}
