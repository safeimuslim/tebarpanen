"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { AppRole } from "@/app/lib/authz"
import {
  Fish,
  Home,
  ShieldCheck,
  Users,
  Wallet,
  Waves,
  Wrench,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const menuGroups = [
  {
    items: [
      { title: "Dashboard", href: "/dashboard", icon: Home },
      { title: "Keuangan", href: "/keuangan", icon: Wallet },
    ],
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
  role,
}: {
  role: AppRole
}) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile, state } = useSidebar()
  const isCompact = state === "collapsed" && !isMobile
  const visibleMenuGroups =
    role === "WORKER"
      ? menuGroups.filter(
          (group) => group.title !== "Master Data" && group.title !== "Pengaturan"
        )
      : menuGroups

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader
        className={cn(
          "flex h-20 items-center px-5",
          isCompact ? "justify-center px-3" : "justify-start"
        )}
      >
        <Link
          className={cn(
            "flex items-center",
            isCompact ? "justify-center" : "justify-start"
          )}
          href="/dashboard"
          onClick={() => setOpenMobile(false)}
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
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-5 p-3">
        {visibleMenuGroups.map((group, index) => (
          <SidebarGroup key={group.title ?? index}>
            {group.title && !isCompact ? (
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            ) : null}

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = isActivePath(pathname, item.href)

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.href} onClick={() => setOpenMobile(false)}>
                          <Icon className="size-4 shrink-0" />
                          {!isCompact ? (
                            <span className="truncate">{item.title}</span>
                          ) : null}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!isCompact ? (
          <div className="text-muted-foreground px-3 text-xs">
            MVP operasional
          </div>
        ) : null}
      </SidebarFooter>
    </Sidebar>
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
