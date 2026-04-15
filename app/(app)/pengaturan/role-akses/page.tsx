import {
  Check,
  LockKeyhole,
  ShieldCheck,
  UserCog,
  Users,
  X,
} from "lucide-react"
import { redirect } from "next/navigation"

import { requireSessionUser } from "@/app/lib/authz"
import { prisma } from "@/app/lib/prisma"

const permissions = [
  {
    module: "Dashboard",
    superAdmin: true,
    farmAdmin: true,
    worker: true,
  },
  {
    module: "Master Data",
    superAdmin: true,
    farmAdmin: true,
    worker: false,
  },
  {
    module: "Siklus Budidaya",
    superAdmin: true,
    farmAdmin: true,
    worker: true,
  },
  {
    module: "Pencatatan Operasional",
    superAdmin: true,
    farmAdmin: true,
    worker: true,
  },
  {
    module: "Laporan",
    superAdmin: true,
    farmAdmin: true,
    worker: false,
  },
  {
    module: "Pengaturan",
    superAdmin: true,
    farmAdmin: true,
    worker: false,
  },
]

const roleMeta = {
  SUPER_ADMIN: {
    description: "Akses penuh untuk pengelolaan platform, farm, dan monitoring data lintas akun.",
    icon: ShieldCheck,
    label: "Super Admin",
  },
  FARM_ADMIN: {
    description: "Kelola data farm, pekerja, master data, dan operasional budidaya pada farm miliknya.",
    icon: UserCog,
    label: "Admin Farm",
  },
  WORKER: {
    description: "Input dan melihat data operasional sesuai farm tempat user tersebut terdaftar.",
    icon: Users,
    label: "Pekerja",
  },
} as const

export default async function RoleAksesPage() {
  const sessionUser = await requireSessionUser()

  if (sessionUser.role === "WORKER") {
    redirect("/dashboard")
  }

  const counts = await getRoleCounts(sessionUser)

  const roleCards = [
    {
      key: "SUPER_ADMIN" as const,
      users: counts.SUPER_ADMIN,
    },
    {
      key: "FARM_ADMIN" as const,
      users: counts.FARM_ADMIN,
    },
    {
      key: "WORKER" as const,
      users: counts.WORKER,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground text-sm">Pengaturan</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Role & Akses
        </h1>
        <p className="text-muted-foreground mt-2 max-w-3xl text-sm">
          Role aplikasi bersifat tetap dan dibatasi oleh sistem. Jumlah user di
          bawah ini diambil langsung dari database sesuai cakupan akses akun Anda.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {roleCards.map((role) => {
          const meta = roleMeta[role.key]
          const Icon = meta.icon

          return (
            <article
              className="border-border bg-card text-card-foreground rounded-lg border p-5"
              key={role.key}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                  <Icon className="size-5" />
                </div>
                <span className="border-border bg-muted rounded-full border px-2 py-0.5 text-xs font-medium">
                  {formatUsers(role.users)}
                </span>
              </div>

              <h2 className="mt-4 font-semibold">{meta.label}</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                {meta.description}
              </p>
            </article>
          )
        })}
      </section>

      <section className="border-border bg-card text-card-foreground overflow-hidden rounded-lg border">
        <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Matrix Akses</h2>
            <p className="text-muted-foreground text-sm">
              Hak akses operasional yang saat ini berlaku di aplikasi.
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
                <th className="px-4 py-3 font-medium">Super Admin</th>
                <th className="px-4 py-3 font-medium">Admin Farm</th>
                <th className="px-4 py-3 font-medium">Pekerja</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {permissions.map((permission) => (
                <tr key={permission.module}>
                  <td className="px-4 py-3 font-medium">{permission.module}</td>
                  <td className="px-4 py-3">
                    <AccessState enabled={permission.superAdmin} />
                  </td>
                  <td className="px-4 py-3">
                    <AccessState enabled={permission.farmAdmin} />
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

      <section className="border-border bg-card text-card-foreground rounded-lg border p-5">
        <div className="flex items-start gap-3">
          <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
            <LockKeyhole className="size-5" />
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold">Catatan Sistem</h2>
            <p className="text-muted-foreground text-sm">
              Super admin dibuat oleh sistem saat awal aplikasi disiapkan.
              Admin farm mendaftar melalui halaman registrasi, lalu dapat
              menambahkan user pekerja untuk farm miliknya.
              User pekerja hanya bisa melihat dan menginput data yang berada
              dalam farm yang sama dengan admin farm yang menambahkannya.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

async function getRoleCounts(user: Awaited<ReturnType<typeof requireSessionUser>>) {
  if (user.role === "SUPER_ADMIN") {
    const grouped = await prisma.user.groupBy({
      by: ["role"],
      _count: {
        _all: true,
      },
    })

    return {
      SUPER_ADMIN: grouped.find((item) => item.role === "SUPER_ADMIN")?._count._all ?? 0,
      FARM_ADMIN: grouped.find((item) => item.role === "FARM_ADMIN")?._count._all ?? 0,
      WORKER: grouped.find((item) => item.role === "WORKER")?._count._all ?? 0,
    }
  }

  const farmId = user.farmId

  const [farmAdminCount, workerCount] = await Promise.all([
    prisma.user.count({
      where: {
        farmId,
        role: "FARM_ADMIN",
      },
    }),
    prisma.user.count({
      where: {
        farmId,
        role: "WORKER",
      },
    }),
  ])

  return {
    SUPER_ADMIN: 0,
    FARM_ADMIN: farmAdminCount,
    WORKER: workerCount,
  }
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

function formatUsers(count: number) {
  return `${count} user`
}
