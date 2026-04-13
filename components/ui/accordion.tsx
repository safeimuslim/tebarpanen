"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({ ...props }: AccordionPrimitive.Root.Props) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-border rounded-md border", className)}
      data-slot="accordion-item"
      {...props}
    />
  )
}

function AccordionHeader({
  className,
  ...props
}: AccordionPrimitive.Header.Props) {
  return (
    <AccordionPrimitive.Header
      className={cn("flex", className)}
      data-slot="accordion-header"
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Trigger
      className={cn(
        "flex flex-1 items-center justify-between gap-3 px-3 py-2.5 text-left text-sm font-medium outline-none transition-all hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/40",
        className
      )}
      data-slot="accordion-trigger"
      {...props}
    >
      {children}
      <ChevronDown className="size-4 shrink-0 transition-transform data-[panel-open]:rotate-180" />
    </AccordionPrimitive.Trigger>
  )
}

function AccordionContent({
  className,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      className={cn(
        "overflow-hidden text-sm data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0",
        className
      )}
      data-slot="accordion-content"
      {...props}
    />
  )
}

export {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
}
