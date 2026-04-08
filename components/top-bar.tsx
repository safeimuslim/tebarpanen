import Link from "next/link"
import { LogOut, Menu, User } from "lucide-react"

import { signOut } from "@/auth"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type TopBarProps = {
  user: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

export function TopBar({ user }: TopBarProps) {
  return (
    <header className="border-border fixed left-0 right-0 top-0 z-50 flex min-h-20 items-center justify-between gap-3 border-b bg-[#ffffff] px-4 py-3 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <label
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "md:hidden"
          )}
          htmlFor="mobile-sidebar-toggle"
        >
          <span className="sr-only">Buka menu</span>
          <Menu className="size-4" />
        </label>

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

        <form
          action={async () => {
            "use server"

            await signOut({ redirectTo: "/login" })
          }}
        >
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
