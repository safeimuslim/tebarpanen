import { Plus, UserRound } from "lucide-react"
import { redirect } from "next/navigation"

import { createWorker, deleteWorker, updateWorker } from "./actions"
import { prisma } from "@/app/lib/prisma"
import { requireSessionUser } from "@/app/lib/authz"
import { ActionForm } from "@/components/action-form"
import { CrudRowActions } from "@/components/crud-row-actions"
import { FormSubmitButton } from "@/components/form-submit-button"
import { Button, buttonVariants } from "@/components/ui/button"
import { SummaryCard } from "@/components/ui/summary-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export default async function UserPage() {
  const sessionUser = await requireSessionUser()

  if (sessionUser.role === "WORKER") {
    redirect("/dashboard")
  }

  if (sessionUser.role === "SUPER_ADMIN") {
    const farmAdmins = await prisma.user.findMany({
      where: {
        role: "FARM_ADMIN",
      },
      include: {
        managedFarm: true,
      },
      orderBy: [{ createdAt: "desc" }, { name: "asc" }],
    })

    return <SuperAdminUserPage farmAdmins={farmAdmins} />
  }

  const farmId = sessionUser.farmId

  if (!farmId) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-muted-foreground text-sm">Pengaturan</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">User</h1>
        </div>
        <p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">
          Akun admin farm belum terhubung ke farm. Selesaikan setup farm terlebih
          dahulu.
        </p>
      </div>
    )
  }

  const [farm, workers] = await Promise.all([
    prisma.farm.findUnique({
      where: {
        id: farmId,
      },
    }),
    prisma.user.findMany({
      where: {
        farmId,
        role: "WORKER",
      },
      orderBy: [{ createdAt: "desc" }, { name: "asc" }],
    }),
  ])

  const activeWorkers = workers.filter((worker) => worker.isActive).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Pengaturan</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">User</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Kelola user pekerja yang dapat mengakses data milik farm{" "}
            <span className="text-foreground font-medium">
              {farm?.name ?? "Anda"}
            </span>
            .
          </p>
        </div>

        <Dialog>
          <DialogTrigger
            render={<Button className="gap-2" size="lg" type="button" />}
          >
            <Plus className="size-4" />
            Tambah User Pekerja
          </DialogTrigger>
          <DialogContent
            className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto p-0 sm:max-w-2xl"
            showCloseButton={false}
          >
            <DialogHeader className="border-border border-b p-5">
              <p className="text-muted-foreground text-sm">User Pekerja</p>
              <DialogTitle>Tambah User Pekerja</DialogTitle>
              <DialogDescription>
                User baru otomatis hanya dapat mengakses data farm ini.
              </DialogDescription>
            </DialogHeader>
            <UserForm
              action={createWorker}
              closeTargetId="create-worker-dialog-close"
              submitLabel="Simpan User"
            />
          </DialogContent>
        </Dialog>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total Pekerja" value={String(workers.length)} />
        <SummaryCard label="Pekerja Aktif" value={String(activeWorkers)} />
        <SummaryCard label="Farm" value={farm?.name ?? "-"} />
      </section>

      <section className="border-border bg-card text-card-foreground overflow-hidden rounded-lg border">
        <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">List User Pekerja</h2>
            <p className="text-muted-foreground text-sm">
              Semua user pada list ini hanya dapat mengakses data milik farm
              Anda.
            </p>
          </div>
          <span className="text-muted-foreground text-sm">
            {workers.length} user
          </span>
        </div>

        <div className="divide-border divide-y">
          {workers.length === 0 ? (
            <div className="text-muted-foreground p-6 text-sm">
              Belum ada user pekerja.
            </div>
          ) : (
            workers.map((worker) => (
              <article
                className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
                key={worker.id}
              >
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                      <UserRound className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{worker.name}</h3>
                      <p className="text-muted-foreground truncate text-sm">
                        {worker.email}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-xs font-medium",
                        worker.isActive
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground"
                      )}
                    >
                      {worker.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm lg:grid-cols-1">
                  <UserMetric label="HP" value={worker.phone ?? "-"} />
                  <UserMetric label="Role" value="Pekerja" />
                </dl>

                <CrudRowActions
                  deleteAction={deleteWorker}
                  deleteDescription="Data user pekerja ini akan dihapus:"
                  detailContent={<UserDetailContent user={worker} />}
                  detailDescription="Informasi detail user pekerja"
                  detailTitle="Detail User"
                  editContent={
                    <UserForm
                      action={updateWorker}
                      closeTargetId={`edit-worker-dialog-close-${worker.id}`}
                      submitLabel="Simpan Perubahan"
                      user={worker}
                    />
                  }
                  editDescription="Perbarui data user pekerja"
                  editTitle="Edit User"
                  itemId={worker.id}
                  itemName={worker.name}
                />
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function SuperAdminUserPage({
  farmAdmins,
}: {
  farmAdmins: Array<{
    id: string
    name: string
    email: string
    phone: string | null
    isActive: boolean
    managedFarm: {
      id: string
      name: string
      description: string | null
    } | null
  }>
}) {
  const activeAdmins = farmAdmins.filter((user) => user.isActive).length

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground text-sm">Pengaturan</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">User</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
          Super admin dibuat melalui migration. Admin farm mendaftar sendiri
          lewat halaman registrasi, lalu mengelola pekerja di farm masing-masing.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Admin Farm" value={String(farmAdmins.length)} />
        <SummaryCard label="Admin Aktif" value={String(activeAdmins)} />
        <SummaryCard label="Registrasi" value="Mandiri" />
      </section>

      <section className="border-border bg-card text-card-foreground overflow-hidden rounded-lg border">
        <div className="border-border border-b p-4">
          <h2 className="font-semibold">List Admin Farm</h2>
          <p className="text-muted-foreground text-sm">
            Data admin farm yang sudah mendaftar.
          </p>
        </div>

        <div className="divide-border divide-y">
          {farmAdmins.length === 0 ? (
            <div className="text-muted-foreground p-6 text-sm">
              Belum ada admin farm terdaftar.
            </div>
          ) : (
            farmAdmins.map((user) => (
              <article
                className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
                key={user.id}
              >
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                      <UserRound className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{user.name}</h3>
                      <p className="text-muted-foreground truncate text-sm">
                        {user.email}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-xs font-medium",
                        user.isActive
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground"
                      )}
                    >
                      {user.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <UserMetric label="Farm" value={user.managedFarm?.name ?? "-"} />
                  <UserMetric label="HP" value={user.phone ?? "-"} />
                </dl>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function UserForm({
  action,
  closeTargetId,
  submitLabel,
  user,
}: {
  action: Parameters<typeof ActionForm>[0]["action"]
  closeTargetId: string
  submitLabel: string
  user?: {
    id: string
    name: string
    email: string
    phone: string | null
    isActive: boolean
  }
}) {
  return (
    <ActionForm
      action={action}
      className="space-y-5 p-5"
      closeTargetId={closeTargetId}
      resetOnSuccess={!user}
    >
      {user ? <input name="id" type="hidden" value={user.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FormField defaultValue={user?.name} label="Nama" name="name" />
        <FormField
          defaultValue={user?.email}
          label="Email"
          name="email"
          type="email"
        />
        <FormField
          defaultValue={user?.phone ?? ""}
          label="HP"
          name="phone"
          type="tel"
        />
        <SelectField
          defaultValue={user?.isActive ? "ACTIVE" : "INACTIVE"}
          label="Status"
          name="status"
          options={[
            { label: "Aktif", value: "ACTIVE" },
            { label: "Nonaktif", value: "INACTIVE" },
          ]}
        />
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium" htmlFor={user ? `password-${user.id}` : "password"}>
            {user ? "Password Baru" : "Password"}
          </label>
          <input
            className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
            id={user ? `password-${user.id}` : "password"}
            name="password"
            placeholder={user ? "Kosongkan jika tidak diubah" : "Minimal 6 karakter"}
            type="password"
            required={!user}
          />
        </div>
      </div>

      <div className="border-border flex justify-end gap-2 border-t pt-4">
        <DialogClose
          id={closeTargetId}
          render={
            <button
              className={cn(buttonVariants({ variant: "outline" }))}
              type="button"
            />
          }
        >
          Batal
        </DialogClose>
        <FormSubmitButton pendingLabel="Menyimpan..." type="submit">
          {submitLabel}
        </FormSubmitButton>
      </div>
    </ActionForm>
  )
}

function UserDetailContent({
  user,
}: {
  user: {
    name: string
    email: string
    phone: string | null
    isActive: boolean
    createdAt: Date
  }
}) {
  return (
    <div className="space-y-4 p-5">
      <dl className="grid gap-4 md:grid-cols-2">
        <UserMetric label="Nama" value={user.name} />
        <UserMetric label="Email" value={user.email} />
        <UserMetric label="HP" value={user.phone ?? "-"} />
        <UserMetric label="Role" value="Pekerja" />
        <UserMetric label="Status" value={user.isActive ? "Aktif" : "Nonaktif"} />
        <UserMetric
          label="Dibuat"
          value={new Intl.DateTimeFormat("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(user.createdAt)}
        />
      </dl>
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
  defaultValue,
  label,
  name,
  type = "text",
}: {
  defaultValue?: string
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
        className="border-input bg-white text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
        defaultValue={defaultValue}
        id={name}
        name={name}
        required
        type={type}
      />
    </div>
  )
}

function SelectField({
  defaultValue,
  label,
  name,
  options,
}: {
  defaultValue?: string
  label: string
  name: string
  options: Array<{ label: string; value: string }>
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <select
        className="border-input bg-white text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-3"
        defaultValue={defaultValue}
        id={name}
        name={name}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
