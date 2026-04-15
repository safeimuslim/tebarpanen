import Form from "next/form"
import Link from "next/link"
import { Search } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import {
  equipmentConditionLabels,
  equipmentTypeLabels,
} from "../constants"
import type { EquipmentFilters } from "../types"

export function EquipmentFiltersSection({
  filters,
}: {
  filters: EquipmentFilters
}) {
  return (
    <section className="border-border bg-card rounded-lg border p-4">
      <Form
        action=""
        className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(0,0.8fr))_auto_auto]"
        replace
        scroll={false}
      >
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border pr-3 pl-9 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
            defaultValue={filters.query}
            name="query"
            placeholder="Cari nama, merek, atau nomor seri"
          />
        </div>
        <select
          className="border-input bg-white text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={filters.type}
          name="type"
        >
          <option value="">Semua jenis</option>
          {Object.entries(equipmentTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          className="border-input bg-white text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={filters.condition}
          name="condition"
        >
          <option value="">Semua kondisi</option>
          {Object.entries(equipmentConditionLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <Button className="gap-2" type="submit">
          <Search className="size-4" />
          Filter
        </Button>
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "justify-center")}
          href="/alat"
        >
          Reset
        </Link>
      </Form>
    </section>
  )
}
