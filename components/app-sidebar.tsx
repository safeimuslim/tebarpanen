import Link from "next/link"
import {
  Fish,
  Home,
  LogOut,
  ShieldCheck,
  User,
  Users,
  Waves,
  Wrench,
} from "lucide-react"

import { signOut } from "@/auth"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const menuGroups = [
  {
    items: [{ title: "Dashboard", href: "/dashboard", icon: Home }],
  },
  {
    title: "Master Data",
    items: [
      { title: "Kolam", href: "/kolam", icon: Waves },
      { title: "Alat", href: "/alat", icon: Wrench },
    ],
  },
  {
    items: [{ title: "Siklus Budidaya", href: "/siklus-budidaya", icon: Fish }],
  },
  {
    title: "Pengaturan",
    items: [
      { title: "User Karyawan", href: "/pengaturan/user-karyawan", icon: Users },
      { title: "Role & Akses", href: "/pengaturan/role-akses", icon: ShieldCheck },
    ],
  },
]

export function AppSidebar() {
  return (
    <aside className="border-border bg-sidebar text-sidebar-foreground flex min-h-screen w-full flex-col border-r md:w-72">
      <div className="border-border border-b px-5 py-4">
        <p className="text-lg font-semibold">Tebar Panen</p>
        <p className="text-muted-foreground mt-1 text-sm">Operasional budidaya</p>
      </div>

      <nav className="flex flex-1 flex-col gap-5 p-3">
        {menuGroups.map((group, index) => (
          <div key={group.title ?? index} className="space-y-1">
            {group.title ? (
              <p className="text-muted-foreground px-3 text-xs font-medium uppercase tracking-wide">
                {group.title}
              </p>
            ) : null}

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "h-10 justify-start gap-3 px-3 w-full"
                    )}
                  >
                    <Icon className="size-4" />
                    {item.title}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        <div className="border-border mt-auto space-y-1 border-t pt-3">
          <Link
            href="/profile"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-10 justify-start gap-3 px-3 w-full"
            )}
          >
            <User className="size-4" />
            Profile
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
                "h-10 justify-start gap-3 px-3 w-full"
              )}
              type="submit"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </form>
        </div>
      </nav>
    </aside>
  )
}
