import Form from "next/form"
import Link from "next/link"
import { Search } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { pondShapeLabels, pondStatusLabels, pondTypeLabels } from "../constants"
import type { PondFilters } from "../types"

export function PondFiltersSection({
  embedded = false,
  filters,
}: {
  embedded?: boolean
  filters: PondFilters
}) {
  const content = (
    <Form
      action=""
      className="space-y-4 p-4 sm:p-5"
      replace
      scroll={false}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Filter Kolam</h2>
          <p className="text-muted-foreground text-sm">
            Cari kolam lebih cepat berdasarkan nama, jenis, bentuk, dan status.
          </p>
        </div>
        <span className="text-muted-foreground text-sm">
          Filter aktif sesuai parameter pencarian
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_12rem_12rem_12rem_auto_auto]">
        <label className="relative block">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border pr-3 pl-9 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
            defaultValue={filters.query}
            name="query"
            placeholder="Cari nama atau kode kolam"
          />
        </label>
        <select
          className="border-input bg-white text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={filters.type}
          name="type"
        >
          <option value="">Semua jenis</option>
          {Object.entries(pondTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          className="border-input bg-white text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={filters.shape}
          name="shape"
        >
          <option value="">Semua bentuk</option>
          {Object.entries(pondShapeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          className="border-input bg-white text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
          defaultValue={filters.status}
          name="status"
        >
          <option value="">Semua status</option>
          {Object.entries(pondStatusLabels).map(([value, label]) => (
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
          href="/kolam"
        >
          Reset
        </Link>
      </div>
    </Form>
  )

  if (embedded) {
    return content
  }

  return (
    <section className="border-border bg-card overflow-hidden rounded-lg border">
      {content}
    </section>
  )
}
