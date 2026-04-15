"use client"

import type { AppRole } from "@/app/lib/authz"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

type AppShellProps = {
  children: React.ReactNode
  user: {
    name?: string | null
    email?: string | null
    role?: AppRole | null
  }
}

export function AppShell({ children, user }: AppShellProps) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar role={user.role ?? "WORKER"} />

      <SidebarInset className="text-foreground">
        <TopBar user={user} />

        <div className="p-4 md:p-6">
          <div className="mx-auto">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
