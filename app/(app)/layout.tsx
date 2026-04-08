import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
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
    <main className="bg-background text-foreground min-h-screen">
      <input
        aria-hidden="true"
        className="peer sr-only md:hidden"
        id="mobile-sidebar-toggle"
        type="checkbox"
      />
      <TopBar user={session.user} />
      <AppSidebar />
      <label
        aria-label="Tutup menu"
        className="bg-foreground/40 fixed inset-x-0 bottom-0 top-20 z-30 hidden peer-checked:block md:hidden"
        htmlFor="mobile-sidebar-toggle"
      />
      <section className="min-h-screen bg-[#F9FAFB] md:pl-72">
        <div className="p-4 pt-24 md:p-6 md:pt-28">
          <div className="mx-auto px-4">{children}</div>
        </div>
      </section>
    </main>
  );
}
