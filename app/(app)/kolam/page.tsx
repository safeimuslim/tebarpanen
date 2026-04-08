import { Eye, Pencil, Plus, Trash2, Waves } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ponds = [
  {
    name: "Kolam A1",
    type: "Terpal",
    shape: "Persegi",
    size: "8m x 4m x 1,2m",
    capacity: "4.000 ekor",
    status: "Aktif",
    location: "Farm Utama",
  },
  {
    name: "Kolam A2",
    type: "Beton",
    shape: "Bulat",
    size: "10m x 5m x 1,5m",
    capacity: "6.500 ekor",
    status: "Aktif",
    location: "Farm Utama",
  },
  {
    name: "Kolam B1",
    type: "Tanah",
    shape: "Persegi",
    size: "14m x 8m x 1,3m",
    capacity: "9.000 ekor",
    status: "Perawatan",
    location: "Farm Timur",
  },
]

export default function KolamPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Master Data</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Kolam</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Data kolam yang dapat dipilih saat membuat siklus budidaya.
          </p>
        </div>

        <button
          className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          popoverTarget="create-pond-modal"
          type="button"
        >
          <Plus className="size-4" />
          Tambah Kolam
        </button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total Kolam" value="12" />
        <SummaryCard label="Aktif" value="8" />
        <SummaryCard label="Perawatan" value="2" />
      </section>

      <section className="border-border bg-card text-card-foreground overflow-hidden rounded-lg border shadow-sm">
        <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">List Kolam</h2>
            <p className="text-muted-foreground text-sm">
              Wireframe master kolam, belum terhubung ke database.
            </p>
          </div>
          <span className="text-muted-foreground text-sm">
            {ponds.length} kolam
          </span>
        </div>

        <div className="divide-border divide-y">
          {ponds.map((pond) => (
            <article
              className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
              key={pond.name}
            >
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                    <Waves className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{pond.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {pond.location}
                    </p>
                  </div>
                  <span className="border-border bg-muted rounded-full border px-2 py-0.5 text-xs font-medium">
                    {pond.status}
                  </span>
                </div>
              </div>

              <dl className="grid grid-cols-3 gap-3 text-sm lg:grid-cols-1">
                <MasterMetric label="Jenis" value={pond.type} />
                <MasterMetric label="Bentuk" value={pond.shape} />
                <MasterMetric label="Kapasitas" value={pond.capacity} />
              </dl>

              <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                <Button className="gap-2" size="sm" type="button" variant="outline">
                  <Eye className="size-4" />
                  Detail
                </Button>
                <Button className="gap-2" size="sm" type="button" variant="outline">
                  <Pencil className="size-4" />
                  Edit
                </Button>
                <Button
                  className="gap-2"
                  size="sm"
                  type="button"
                  variant="destructive"
                >
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
        id="create-pond-modal"
        popover="auto"
      >
        <div className="w-full">
          <div className="border-border border-b p-5">
            <p className="text-muted-foreground text-sm">Wireframe Form</p>
            <h2 className="mt-1 text-xl font-semibold">Tambah Kolam</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Form ini belum menyimpan data ke database.
            </p>
          </div>

          <form className="space-y-5 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Nama Kolam" name="name" />
              <FormField label="Kode Kolam" name="code" />
              <SelectField
                label="Jenis Kolam"
                name="type"
                options={["Terpal", "Beton", "Tanah"]}
              />
              <SelectField
                label="Bentuk Kolam"
                name="shape"
                options={["Persegi", "Bulat"]}
              />
              <SelectField
                label="Status"
                name="status"
                options={["Aktif", "Kosong", "Perawatan"]}
              />
              <FormField label="Panjang (m)" name="length" type="number" />
              <FormField label="Lebar (m)" name="width" type="number" />
              <FormField label="Kedalaman (m)" name="depth" type="number" />
              <FormField label="Kapasitas" name="capacity" type="number" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="notes">
                Catatan
              </label>
              <textarea
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
                id="notes"
                name="notes"
                placeholder="Catatan kolam"
              />
            </div>

            <div className="border-border flex justify-end gap-2 border-t pt-4">
              <button
                className={cn(buttonVariants({ variant: "outline" }))}
                popoverTarget="create-pond-modal"
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

function MasterMetric({ label, value }: { label: string; value: string }) {
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

function SelectField({
  label,
  name,
  options,
}: {
  label: string
  name: string
  options: string[]
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <select
        className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
        id={name}
        name={name}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}
