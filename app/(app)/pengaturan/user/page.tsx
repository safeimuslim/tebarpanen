import { Eye, Pencil, Plus, Trash2, UserRound } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const users = [
  {
    name: "Safei Muslim",
    email: "safeydev@gmail.com",
    phone: "082329230000",
    role: "Super Admin",
    status: "Aktif",
  },
  {
    name: "Admin Farm Utama",
    email: "admin@tebarpanen.local",
    phone: "081200001111",
    role: "Admin",
    status: "Aktif",
  },
  {
    name: "Pekerja Kolam A",
    email: "pekerja-a@tebarpanen.local",
    phone: "081200002222",
    role: "Pekerja",
    status: "Aktif",
  },
]

export default function UserPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Pengaturan</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">User</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Kelola user karyawan yang dapat mengakses dashboard, master data,
            dan pencatatan operasional.
          </p>
        </div>

        <button
          className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          popoverTarget="create-user-modal"
          type="button"
        >
          <Plus className="size-4" />
          Tambah User
        </button>
      </div>

      <section className="border-border bg-card text-card-foreground overflow-hidden rounded-lg border shadow-sm">
        <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">List User</h2>
            <p className="text-muted-foreground text-sm">
              Wireframe data user, belum terhubung ke database.
            </p>
          </div>
          <span className="text-muted-foreground text-sm">
            {users.length} user
          </span>
        </div>

        <div className="divide-border divide-y">
          {users.map((user) => (
            <article
              className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
              key={user.email}
            >
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                    <UserRound className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {user.email}
                    </p>
                  </div>
                  <span className="border-border bg-muted rounded-full border px-2 py-0.5 text-xs font-medium">
                    {user.status}
                  </span>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm lg:grid-cols-1">
                <UserMetric label="HP" value={user.phone} />
                <UserMetric label="Role" value={user.role} />
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
        id="create-user-modal"
        popover="auto"
      >
        <div className="w-full">
          <div className="border-border border-b p-5">
            <p className="text-muted-foreground text-sm">Wireframe Form</p>
            <h2 className="mt-1 text-xl font-semibold">Tambah User</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Form ini belum menyimpan data ke database.
            </p>
          </div>

          <form className="space-y-5 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Nama" name="name" />
              <FormField label="Email" name="email" type="email" />
              <FormField label="HP" name="phone" type="tel" />
              <SelectField
                label="Role"
                name="role"
                options={["Owner", "Admin", "Pekerja"]}
              />
              <FormField label="Password" name="password" type="password" />
              <SelectField
                label="Status"
                name="status"
                options={["Aktif", "Nonaktif"]}
              />
            </div>

            <div className="border-border flex justify-end gap-2 border-t pt-4">
              <button
                className={cn(buttonVariants({ variant: "outline" }))}
                popoverTarget="create-user-modal"
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

function UserMetric({ label, value }: { label: string; value: string }) {
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
