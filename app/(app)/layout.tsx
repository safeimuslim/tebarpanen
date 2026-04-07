import { AppSidebar } from "@/components/app-sidebar"
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

  return (
    <main className="bg-background text-foreground min-h-screen md:flex">
      <AppSidebar />
      <section className="flex-1 p-6">
        <div className="mx-auto max-w-5xl">{children}</div>
      </section>
    </main>
  )
}
