"use client"

import * as React from "react"
import { PanelLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SIDEBAR_WIDTH = "18rem"
const SIDEBAR_WIDTH_ICON = "5.5rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"
const MOBILE_BREAKPOINT = 768

type SidebarContextValue = {
  isMobile: boolean
  open: boolean
  openMobile: boolean
  setOpen: (open: boolean) => void
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>
  state: "expanded" | "collapsed"
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const update = () => setIsMobile(mediaQuery.matches)

    update()
    mediaQuery.addEventListener("change", update)

    return () => mediaQuery.removeEventListener("change", update)
  }, [])

  return isMobile
}

function SidebarProvider({
  children,
  defaultOpen = true,
  onOpenChange,
  open: openProp,
  style,
}: React.PropsWithChildren<{
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  style?: React.CSSProperties
}>) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)

  const open = openProp ?? uncontrolledOpen
  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (openProp == null) {
        setUncontrolledOpen(nextOpen)
      }

      onOpenChange?.(nextOpen)
    },
    [onOpenChange, openProp]
  )

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((current) => !current)
      return
    }

    setOpen(!open)
  }, [isMobile, open, setOpen])

  React.useEffect(() => {
    if (!isMobile) {
      setOpenMobile(false)
    }
  }, [isMobile])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (typeof event.key !== "string" || !event.key) {
        return
      }

      const isShortcut =
        event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)

      if (!isShortcut) {
        return
      }

      const target = event.target as HTMLElement | null
      const isEditable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable

      if (isEditable) {
        return
      }

      event.preventDefault()
      toggleSidebar()
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  return (
    <SidebarContext.Provider
      value={{
        isMobile,
        open,
        openMobile,
        setOpen,
        setOpenMobile,
        state: open ? "expanded" : "collapsed",
        toggleSidebar,
      }}
    >
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
            ...style,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

function useSidebar() {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

function Sidebar({
  children,
  className,
  collapsible = "icon",
  side = "left",
  variant = "sidebar",
}: React.PropsWithChildren<{
  className?: string
  collapsible?: "icon" | "offcanvas" | "none"
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
}>) {
  const { isMobile, openMobile, setOpenMobile, state } = useSidebar()
  const isCollapsed = collapsible === "icon" && state === "collapsed"

  const desktopSidebar = (
    <aside
      className={cn(
        "fixed inset-y-0 z-50 hidden flex-col border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex",
        side === "left" ? "left-0 border-r" : "right-0 border-l",
        variant === "floating" && "m-2 rounded-xl border shadow-sm",
        collapsible === "none"
          ? "w-[var(--sidebar-width)]"
          : isCollapsed
            ? "w-[var(--sidebar-width-icon)]"
            : "w-[var(--sidebar-width)]",
        className
      )}
      data-collapsible={isCollapsed ? "icon" : "full"}
      data-side={side}
      data-slot="sidebar"
      data-state={state}
    >
      {children}
    </aside>
  )

  if (!isMobile) {
    return desktopSidebar
  }

  return (
    <>
      {openMobile ? (
        <button
          aria-label="Tutup sidebar"
          className="bg-foreground/40 fixed inset-0 z-40 md:hidden"
          onClick={() => setOpenMobile(false)}
          type="button"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 z-50 flex w-[var(--sidebar-width-mobile)] flex-col border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 md:hidden",
          side === "left" ? "left-0 border-r" : "right-0 border-l",
          openMobile ? "translate-x-0" : side === "left" ? "-translate-x-full" : "translate-x-full",
          className
        )}
        data-mobile={openMobile ? "open" : "closed"}
        data-side={side}
        data-slot="sidebar"
      >
        {children}
      </aside>
    </>
  )
}

function SidebarInset({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { isMobile, open } = useSidebar()

  return (
    <div
      className={cn("min-h-screen bg-background", className)}
      data-slot="sidebar-inset"
      style={{
        paddingLeft: !isMobile
          ? open
            ? "var(--sidebar-width)"
            : "var(--sidebar-width-icon)"
          : undefined,
        transitionDuration: "200ms",
        transitionProperty: "padding-left",
      }}
      {...props}
    >
      {children}
    </div>
  )
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children">) {
  const { isMobile, state, toggleSidebar } = useSidebar()

  return (
    <Button
      className={cn("shrink-0", className)}
      onClick={(event) => {
        onClick?.(event)

        if (!event.defaultPrevented) {
          toggleSidebar()
        }
      }}
      size="icon"
      type="button"
      variant="outline"
      {...props}
    >
      <PanelLeft className="size-4" />
      <span className="sr-only">
        {isMobile
          ? "Buka atau tutup sidebar"
          : state === "collapsed"
            ? "Lebarkan sidebar"
            : "Ciutkan sidebar"}
      </span>
    </Button>
  )
}

function SidebarHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("border-sidebar-border border-b", className)}
      data-slot="sidebar-header"
      {...props}
    />
  )
}

function SidebarFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("border-sidebar-border border-t", className)}
      data-slot="sidebar-footer"
      {...props}
    />
  )
}

function SidebarContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto", className)}
      data-slot="sidebar-content"
      {...props}
    />
  )
}

function SidebarGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("space-y-1", className)}
      data-slot="sidebar-group"
      {...props}
    />
  )
}

function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground",
        className
      )}
      data-slot="sidebar-group-label"
      {...props}
    />
  )
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("space-y-1", className)}
      data-slot="sidebar-group-content"
      {...props}
    />
  )
}

function SidebarMenu({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("space-y-1", className)}
      data-slot="sidebar-menu"
      {...props}
    />
  )
}

function SidebarMenuItem({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(className)}
      data-slot="sidebar-menu-item"
      {...props}
    />
  )
}

function SidebarMenuButton({
  asChild = false,
  children,
  className,
  isActive = false,
  tooltip,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string
}) {
  const { isMobile, state } = useSidebar()
  const isCollapsed = state === "collapsed" && !isMobile
  const sharedClassName = cn(
    "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring/50",
    isCollapsed ? "justify-center px-0" : "justify-start",
    isActive && "bg-sidebar-accent text-sidebar-primary hover:bg-sidebar-accent",
    className
  )

  const title = isCollapsed ? tooltip : undefined

  if (asChild && React.isValidElement(children)) {
    const child =
      children as React.ReactElement<{ className?: string; title?: string }>

    return React.cloneElement(child, {
      className: cn(sharedClassName, child.props.className),
      title: title ?? child.props.title,
    })
  }

  return (
    <button
      className={sharedClassName}
      data-active={isActive}
      title={title}
      {...props}
    >
      {children}
    </button>
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
}
