"use client"

import Link from "next/link"
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, User } from "lucide-react"

import { logoutAction } from "@/app/(app)/shell-actions"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type TopBarProps = {
  user: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

export function TopBar({
  isSidebarCollapsed,
  onToggleMobileSidebar,
  onToggleSidebarCollapse,
  user,
}: TopBarProps & {
  isSidebarCollapsed: boolean
  onToggleMobileSidebar: () => void
  onToggleSidebarCollapse: () => void
}) {
  return (
    <header
      className={cn(
        "border-border fixed left-0 right-0 top-0 z-40 flex min-h-20 items-center justify-between gap-3 border-b bg-[#ffffff] px-4 py-3 transition-[left] duration-200 md:px-6",
        isSidebarCollapsed ? "md:left-24" : "md:left-72"
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "md:hidden"
          )}
          onClick={onToggleMobileSidebar}
          type="button"
        >
          <span className="sr-only">Buka menu</span>
          <Menu className="size-4" />
        </button>

        <button
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "hidden md:inline-flex"
          )}
          onClick={onToggleSidebarCollapse}
          type="button"
        >
          <span className="sr-only">
            {isSidebarCollapsed ? "Lebarkan sidebar" : "Ciutkan sidebar"}
          </span>
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </button>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{user.name ?? "User"}</p>
          <p className="text-muted-foreground truncate text-sm">
            {user.email ?? "Belum ada email"} / {formatRole(user.role)}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "gap-2 px-2 md:px-2.5"
          )}
          href="/profile"
        >
          <User className="size-4" />
          <span className="hidden sm:inline">Profile</span>
        </Link>

        <form action={logoutAction}>
          <button
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "gap-2 px-2 md:px-2.5"
            )}
            type="submit"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </form>
      </div>
    </header>
  )
}

function formatRole(role?: string | null) {
  if (!role) {
    return "Role belum tersedia"
  }

  return role.replaceAll("_", " ")
}
