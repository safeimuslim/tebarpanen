import Link from "next/link"
import {
  Fish,
  Home,
  ShieldCheck,
  Users,
  Waves,
  Wrench,
} from "lucide-react"

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
      { title: "User", href: "/pengaturan/user", icon: Users },
      { title: "Role & Akses", href: "/pengaturan/role-akses", icon: ShieldCheck },
    ],
  },
]

export function AppSidebar() {
  return (
    <aside className="border-border bg-[#ffffff] text-sidebar-foreground fixed bottom-0 left-0 top-20 z-40 flex w-72 -translate-x-full flex-col border-r transition-transform peer-checked:translate-x-0 md:translate-x-0">
      <div className="border-border border-b px-5 py-4">
        <p className="text-lg font-semibold">Tebar Panen</p>
        <p className="text-muted-foreground mt-1 text-sm">Operasional budidaya</p>
      </div>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-3">
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
                      "h-10 w-full justify-start gap-3 px-3"
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
        <div className="text-muted-foreground mt-auto px-3 text-xs">
          MVP operasional
        </div>
      </nav>
    </aside>
  )
}
