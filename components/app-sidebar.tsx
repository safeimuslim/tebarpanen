"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
    title: "Budidaya",
    items: [{ title: "Siklus Budidaya", href: "/siklus-budidaya", icon: Fish }],
  },
  {
    title: "Pengaturan",
    items: [
      { title: "User", href: "/pengaturan/user", icon: Users },
      {
        title: "Role & Akses",
        href: "/pengaturan/role-akses",
        icon: ShieldCheck,
      },
    ],
  },
]

export function AppSidebar({
  collapsed,
  isMobileOpen,
  onNavigate,
}: {
  collapsed: boolean
  isMobileOpen: boolean
  onNavigate: () => void
}) {
  const pathname = usePathname()
  const isCompact = collapsed && !isMobileOpen

  return (
    <aside
      className={cn(
        "border-border bg-[#ffffff] text-sidebar-foreground fixed inset-y-0 left-0 z-50 flex w-72 border-r transition-[width,transform] duration-200",
        isCompact ? "md:w-24" : "md:w-72",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0"
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className={cn(
            "border-border flex h-20 items-center border-b px-5",
            isCompact ? "justify-center px-3" : "justify-start"
          )}
        >
          <div className="bg-primary/12 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
            <Fish className="size-5" />
          </div>
          <div
            className={cn(
              "min-w-0 overflow-hidden transition-[width,opacity,margin] duration-200",
              isCompact ? "ml-0 w-0 opacity-0" : "ml-3 w-auto opacity-100"
            )}
          >
            <p className="truncate text-sm font-semibold">TebarPanen</p>
            <p className="text-muted-foreground truncate text-xs">
              Operasional budidaya
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-3">
          {menuGroups.map((group, index) => (
            <div key={group.title ?? index} className="space-y-1">
              {group.title && !isCompact ? (
                <p className="text-muted-foreground px-3 text-xs font-medium uppercase tracking-wide">
                  {group.title}
                </p>
              ) : null}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = isActivePath(pathname, item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "h-11 w-full gap-3 px-3",
                        isCompact ? "justify-center px-0" : "justify-start",
                        isActive &&
                          "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary"
                      )}
                      onClick={onNavigate}
                      title={isCompact ? item.title : undefined}
                    >
                      <Icon className="size-4 shrink-0" />
                      {!isCompact ? (
                        <span className="truncate">{item.title}</span>
                      ) : null}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
          {!isCompact ? (
            <div className="text-muted-foreground mt-auto px-3 text-xs">
              MVP operasional
            </div>
          ) : null}
        </nav>
      </div>
    </aside>
  )
}

function isActivePath(pathname: string, href: string) {
  if (pathname === href) {
    return true
  }

  if (href === "/") {
    return pathname === href
  }

  return pathname.startsWith(`${href}/`)
}
