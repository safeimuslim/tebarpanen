import { AppSidebar } from "@/components/app-sidebar"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="bg-background text-foreground min-h-screen md:flex">
      <AppSidebar />
      <section className="flex-1 p-6">
        <div className="mx-auto max-w-5xl">{children}</div>
      </section>
    </main>
  )
}
