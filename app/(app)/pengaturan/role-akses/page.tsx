import { Check, LockKeyhole, Pencil, Plus, ShieldCheck, X } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const roles = [
  {
    name: "Owner",
    users: "1 user",
    description: "Akses penuh untuk pengelolaan usaha dan pengaturan.",
  },
  {
    name: "Admin",
    users: "2 user",
    description: "Kelola master data, siklus, dan laporan operasional.",
  },
  {
    name: "Pekerja",
    users: "5 user",
    description: "Input catatan operasional harian sesuai siklus.",
  },
]

const permissions = [
  {
    module: "Dashboard",
    owner: true,
    admin: true,
    worker: true,
  },
  {
    module: "Master Data",
    owner: true,
    admin: true,
    worker: false,
  },
  {
    module: "Siklus Budidaya",
    owner: true,
    admin: true,
    worker: true,
  },
  {
    module: "Pencatatan Operasional",
    owner: true,
    admin: true,
    worker: true,
  },
  {
    module: "Laporan",
    owner: true,
    admin: true,
    worker: false,
  },
  {
    module: "Pengaturan",
    owner: true,
    admin: false,
    worker: false,
  },
]

const editablePermissions = [
  "Dashboard",
  "Master Data",
  "Siklus Budidaya",
  "Pakan",
  "Sampling",
  "Kualitas Air",
  "Mortalitas",
  "Pengobatan",
  "Biaya",
  "Panen",
  "Laporan",
  "Pengaturan",
]

export default function RoleAksesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Pengaturan</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Role & Akses
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Tentukan akses untuk owner, admin, dan pekerja pada setiap modul
            aplikasi.
          </p>
        </div>

        <button
          className={cn(buttonVariants({ size: "lg" }), "gap-2")}
          popoverTarget="edit-role-modal"
          type="button"
        >
          <Plus className="size-4" />
          Tambah Role
        </button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {roles.map((role) => (
          <article
            className="border-border bg-card text-card-foreground rounded-lg border p-4 shadow-sm"
            key={role.name}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                <ShieldCheck className="size-5" />
              </div>
              <span className="border-border bg-muted rounded-full border px-2 py-0.5 text-xs font-medium">
                {role.users}
              </span>
            </div>
            <h2 className="mt-4 font-semibold">{role.name}</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {role.description}
            </p>
            <Button className="mt-4 gap-2" size="sm" type="button" variant="outline">
              <Pencil className="size-4" />
              Edit Role
            </Button>
          </article>
        ))}
      </section>

      <section className="border-border bg-card text-card-foreground overflow-hidden rounded-lg border shadow-sm">
        <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Matrix Akses</h2>
            <p className="text-muted-foreground text-sm">
              Wireframe permission per modul, belum terhubung ke database.
            </p>
          </div>
          <span className="text-muted-foreground text-sm">
            {permissions.length} modul
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-sm">
            <thead className="bg-muted/60 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Modul</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Admin</th>
                <th className="px-4 py-3 font-medium">Pekerja</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {permissions.map((permission) => (
                <tr key={permission.module}>
                  <td className="px-4 py-3 font-medium">{permission.module}</td>
                  <td className="px-4 py-3">
                    <AccessState enabled={permission.owner} />
                  </td>
                  <td className="px-4 py-3">
                    <AccessState enabled={permission.admin} />
                  </td>
                  <td className="px-4 py-3">
                    <AccessState enabled={permission.worker} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-border bg-card text-card-foreground rounded-lg border p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
            <LockKeyhole className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold">Catatan Wireframe</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Owner bisa mengubah role dan akses. Admin dapat diberi akses
              pengelolaan operasional, sedangkan pekerja fokus pada input data
              harian.
            </p>
          </div>
        </div>
      </section>

      <div
        className="backdrop:bg-foreground/30 open:flex fixed inset-0 m-auto hidden h-fit w-[min(92vw,42rem)] rounded-lg border border-border bg-card p-0 text-card-foreground shadow-lg"
        id="edit-role-modal"
        popover="auto"
      >
        <div className="w-full">
          <div className="border-border border-b p-5">
            <p className="text-muted-foreground text-sm">Wireframe Form</p>
            <h2 className="mt-1 text-xl font-semibold">Tambah / Edit Role</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Form ini belum menyimpan data ke database.
            </p>
          </div>

          <form className="space-y-5 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Nama Role" name="roleName" />
              <SelectField
                label="Status"
                name="status"
                options={["Aktif", "Nonaktif"]}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Akses Modul</p>
              <div className="grid gap-2 md:grid-cols-2">
                {editablePermissions.map((permission) => (
                  <label
                    className="border-border bg-background flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                    key={permission}
                  >
                    <input name="permissions" type="checkbox" value={permission} />
                    {permission}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-border flex justify-end gap-2 border-t pt-4">
              <button
                className={cn(buttonVariants({ variant: "outline" }))}
                popoverTarget="edit-role-modal"
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

function AccessState({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={
        enabled
          ? "text-foreground inline-flex items-center gap-1 font-medium"
          : "text-muted-foreground inline-flex items-center gap-1"
      }
    >
      {enabled ? <Check className="size-4" /> : <X className="size-4" />}
      {enabled ? "Ya" : "Tidak"}
    </span>
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
