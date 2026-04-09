import { AppShell } from "@/components/app-shell"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AppLayout({
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
