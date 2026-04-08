import Link from "next/link"
import { CalendarDays, Eye, Pencil, Plus, Trash2 } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const cycles = [
  {
    id: "siklus-lele-batch-01",
    name: "Siklus Lele Batch 01",
    status: "Aktif",
    ponds: ["Kolam A1", "Kolam A2"],
    startDate: "12 Apr 2026",
    seedCount: "8.000 ekor",
    feedUsed: "214 kg",
    survivalRate: "96%",
  },
  {
    id: "pembesaran-nila-merah",
    name: "Pembesaran Nila Merah",
    status: "Sampling",
    ponds: ["Kolam B1"],
    startDate: "02 Apr 2026",
    seedCount: "3.500 ekor",
    feedUsed: "86 kg",
    survivalRate: "98%",
  },
  {
    id: "siklus-gurame-timur",
    name: "Siklus Gurame Timur",
    status: "Persiapan",
    ponds: ["Kolam C1", "Kolam C2", "Kolam C3"],
    startDate: "20 Apr 2026",
    seedCount: "1.200 ekor",
    feedUsed: "0 kg",
    survivalRate: "-",
  },
]

const pondOptions = ["Kolam A1", "Kolam A2", "Kolam B1", "Kolam C1", "Kolam C2"]

export default function SiklusBudidayaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Siklus Budidaya</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Siklus Budidaya
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Kelola periode budidaya, kolam yang digunakan, dan akses detail
            pencatatan operasional per siklus.
          </p>
        </div>

        <button
          className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          popoverTarget="create-cycle-modal"
          type="button"
        >
          <Plus className="size-4" />
          Create Siklus Budidaya
        </button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Siklus Aktif" value="2" />
        <SummaryCard label="Kolam Digunakan" value="6" />
        <SummaryCard label="Estimasi Ikan Hidup" value="12.232" />
      </section>

      <section className="border-border bg-card text-card-foreground overflow-hidden rounded-lg border shadow-sm">
        <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">List Siklus Budidaya</h2>
            <p className="text-muted-foreground text-sm">
              Wireframe data siklus, belum terhubung ke database.
            </p>
          </div>
          <span className="text-muted-foreground text-sm">
            {cycles.length} siklus
          </span>
        </div>

        <div className="divide-border divide-y">
          {cycles.map((cycle) => (
            <article
              className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto]"
              key={cycle.name}
            >
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{cycle.name}</h3>
                  <span className="border-border bg-muted rounded-full border px-2 py-0.5 text-xs font-medium">
                    {cycle.status}
                  </span>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <CalendarDays className="size-4" />
                  Mulai {cycle.startDate}
                </div>
                <div className="flex flex-wrap gap-2">
                  {cycle.ponds.map((pond) => (
                    <span
                      className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-xs"
                      key={pond}
                    >
                      {pond}
                    </span>
                  ))}
                </div>
              </div>

              <dl className="grid grid-cols-3 gap-3 text-sm lg:grid-cols-1">
                <CycleMetric label="Bibit" value={cycle.seedCount} />
                <CycleMetric label="Pakan" value={cycle.feedUsed} />
                <CycleMetric label="Survival" value={cycle.survivalRate} />
              </dl>

              <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                <Link
                  className={cn(
                    buttonVariants({ size: "sm", variant: "outline" }),
                    "gap-2"
                  )}
                  href={`/siklus-budidaya/${cycle.id}`}
                >
                  <Eye className="size-4" />
                  Detail
                </Link>
                <Button className="gap-2" size="sm" variant="outline">
                  <Pencil className="size-4" />
                  Edit
                </Button>
                <Button className="gap-2" size="sm" variant="destructive">
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div
        className="backdrop:bg-foreground/30 open:flex fixed inset-0 m-auto hidden h-fit w-[min(92vw,42rem)] rounded-lg border border-border bg-card p-0 text-card-foreground shadow-lg"
        id="create-cycle-modal"
        popover="auto"
      >
        <div className="w-full">
          <div className="border-border border-b p-5">
            <p className="text-muted-foreground text-sm">Wireframe Form</p>
            <h2 className="mt-1 text-xl font-semibold">
              Create Siklus Budidaya
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Form ini belum menyimpan data ke database.
            </p>
          </div>

          <form className="space-y-5 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Nama Siklus" name="cycleName" />
              <FormField label="Tanggal Mulai" name="startDate" type="date" />
              <FormField label="Jumlah Bibit" name="seedCount" type="number" />
              <FormField label="Ukuran Bibit Awal" name="seedSize" />
              <FormField label="Harga Bibit" name="seedPrice" type="number" />
              <FormField
                label="Target Panen"
                name="targetHarvestDate"
                type="date"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Pilih Kolam</p>
              <div className="grid gap-2 md:grid-cols-2">
                {pondOptions.map((pond) => (
                  <label
                    className="border-border bg-background flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                    key={pond}
                  >
                    <input name="ponds" type="checkbox" value={pond} />
                    {pond}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="notes">
                Catatan
              </label>
              <textarea
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                id="notes"
                name="notes"
                placeholder="Catatan awal siklus"
              />
            </div>

            <div className="border-border flex justify-end gap-2 border-t pt-4">
              <button
                className={cn(buttonVariants({ variant: "outline" }))}
                popoverTarget="create-cycle-modal"
                popoverTargetAction="hide"
                type="button"
              >
                Batal
              </button>
              <Button type="button">Simpan Wireframe</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border bg-card rounded-lg border p-4 shadow-sm">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  )
}

function CycleMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  )
}

function FormField({
  label,
  name,
  type = "text",
}: {
  label: string
  name: string
  type?: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <input
        className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
        id={name}
        name={name}
        type={type}
      />
    </div>
  )
}
