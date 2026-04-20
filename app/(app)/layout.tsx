import { Suspense } from "react"

import { auth } from "@/auth"
import { AppShell } from "@/components/app-shell"
import { redirect } from "next/navigation"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Suspense fallback={<AppLoadingShell />}>
      <AuthenticatedAppShell>{children}</AuthenticatedAppShell>
    </Suspense>
  )
}

async function AuthenticatedAppShell({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return <AppShell user={session.user}>{children}</AppShell>
}

function AppLoadingShell() {
  return (
    <div className="bg-background min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[#deebe8] bg-white lg:block">
          <div className="space-y-6 p-5">
            <div className="animate-pulse rounded-2xl bg-[#e8f1ef] p-4">
              <div className="h-5 w-32 rounded bg-[#dbe9e5]" />
              <div className="mt-2 h-4 w-40 rounded bg-[#edf5f2]" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  className="h-10 animate-pulse rounded-xl bg-[#eef5f3]"
                  key={index}
                />
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="border-b border-[#deebe8] bg-white px-4 py-4 md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="h-8 w-40 animate-pulse rounded-xl bg-[#eef5f3]" />
              <div className="h-9 w-28 animate-pulse rounded-xl bg-[#eef5f3]" />
            </div>
          </div>

          <div className="space-y-5 p-4 md:p-6">
            <div className="rounded-[1.75rem] border border-[#d9e9e4] bg-white p-5">
              <div className="space-y-3">
                <div className="h-4 w-32 animate-pulse rounded bg-[#eef5f3]" />
                <div className="h-9 w-full max-w-xl animate-pulse rounded bg-[#eef5f3]" />
                <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-[#f3f8f6]" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  className="rounded-[1.4rem] border border-[#d9e9e4] bg-white p-5"
                  key={index}
                >
                  <div className="space-y-3">
                    <div className="h-4 w-24 animate-pulse rounded bg-[#eef5f3]" />
                    <div className="h-7 w-32 animate-pulse rounded bg-[#eef5f3]" />
                    <div className="h-4 w-full animate-pulse rounded bg-[#f3f8f6]" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-[#f3f8f6]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
