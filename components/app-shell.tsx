"use client"

import { useState } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { cn } from "@/lib/utils"

type AppShellProps = {
  children: React.ReactNode
  user: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

export function AppShell({ children, user }: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <main className="bg-background text-foreground min-h-screen">
      <AppSidebar
        collapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onNavigate={() => setIsMobileSidebarOpen(false)}
      />

      {isMobileSidebarOpen ? (
        <button
          aria-label="Tutup menu"
          className="bg-foreground/40 fixed inset-0 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          type="button"
        />
      ) : null}

      <TopBar
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((value) => !value)}
        onToggleSidebarCollapse={() =>
          setIsSidebarCollapsed((value) => !value)
        }
        user={user}
      />

      <section
        className={cn(
          "min-h-screen bg-background pt-24 transition-[padding] duration-200 md:pt-6",
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        )}
      >
        <div className="p-4 md:p-6">
          <div className="mx-auto px-4 md:pt-20">{children}</div>
        </div>
      </section>
    </main>
  )
}
