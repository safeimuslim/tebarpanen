"use client"

import { BanknoteArrowDown, Plus } from "lucide-react"

import { CrudRowActions } from "@/components/crud-row-actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SummaryCard } from "@/components/ui/summary-card"

import { expenseCategoryLabels } from "../../constants"
import { formatCurrency, formatDate, formatNumber } from "../../utils"
import {
  createExpenseLog,
  deleteExpenseLog,
  updateExpenseLog,
} from "../actions"
import type { ExpenseLogItem } from "../types"
import { ExpenseLogDetailContent } from "./expense-log-detail-content"
import { ExpenseLogForm } from "./expense-log-form"

export function ExpenseLogSection({
  canManage,
  cycleId,
  expenseLogs,
}: {
  canManage: boolean
  cycleId: string
  expenseLogs: ExpenseLogItem[]
}) {
  const totalExpense = expenseLogs.reduce((sum, item) => sum + item.amount, 0)

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Biaya</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Pencatatan biaya manual per siklus. Harga bibit, pakan, dan pengobatan
            yang tercatat di modul lain belum dijumlahkan otomatis di sini.
          </p>
        </div>

        {canManage ? (
          <Dialog>
            <DialogTrigger
              render={<Button className="gap-2" type="button" variant="default" />}
            >
              <Plus className="size-4" />
              Tambah Biaya
            </DialogTrigger>
            <DialogContent
              className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto p-0 sm:max-w-2xl"
              showCloseButton={false}
            >
              <DialogHeader className="border-border border-b p-5">
                <p className="text-muted-foreground text-sm">Form Operasional Siklus</p>
                <DialogTitle>Tambah Data Biaya</DialogTitle>
                <DialogDescription>
                  Catatan biaya akan tersimpan untuk siklus budidaya ini.
                </DialogDescription>
              </DialogHeader>
              <ExpenseLogForm
                action={createExpenseLog}
                closeTargetId="create-expense-log-dialog-close"
                cycleId={cycleId}
                submitLabel="Simpan Data Biaya"
              />
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Jumlah Catatan" value={formatNumber(expenseLogs.length)} />
        <SummaryCard label="Total Biaya Manual" value={formatCurrency(totalExpense)} />
        <SummaryCard
          label="Biaya Terakhir"
          value={expenseLogs[0] ? formatDate(expenseLogs[0].logDate) : "-"}
        />
      </div>

      <div className="border-border bg-card overflow-hidden rounded-lg border">
        <div className="border-border flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">List Biaya</h3>
            <p className="text-muted-foreground text-sm">
              Data biaya manual yang sudah tercatat pada siklus ini.
            </p>
          </div>
          <span className="text-muted-foreground text-sm">
            {formatNumber(expenseLogs.length)} catatan
          </span>
        </div>

        {expenseLogs.length ? (
          <div className="divide-border divide-y">
            {expenseLogs.map((expenseLog) => (
              <article
                className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]"
                key={expenseLog.id}
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted flex size-8 items-center justify-center rounded-md">
                      <BanknoteArrowDown className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate font-semibold">{expenseLog.title}</h4>
                      <p className="text-muted-foreground text-sm">
                        {formatDate(expenseLog.logDate)}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {expenseCategoryLabels[expenseLog.category]}
                  </p>
                  {expenseLog.notes ? (
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {expenseLog.notes}
                    </p>
                  ) : null}
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3 lg:grid-cols-1">
                  <Metric
                    label="Kategori"
                    value={expenseCategoryLabels[expenseLog.category]}
                  />
                  <Metric label="Nominal" value={formatCurrency(expenseLog.amount)} />
                  <Metric label="Dicatat" value={formatDate(expenseLog.createdAt)} />
                </dl>

                {canManage ? (
                  <CrudRowActions
                    deleteAction={deleteExpenseLog}
                    deleteDescription="Data biaya yang dihapus tidak bisa dikembalikan untuk"
                    deleteHiddenFields={[{ name: "cycleId", value: cycleId }]}
                    detailContent={<ExpenseLogDetailContent expenseLog={expenseLog} />}
                    detailDescription={formatDate(expenseLog.logDate)}
                    detailTitle={expenseLog.title}
                    editContent={
                      <ExpenseLogForm
                        action={updateExpenseLog}
                        closeTargetId={`edit-expense-log-dialog-close-${expenseLog.id}`}
                        cycleId={cycleId}
                        expenseLog={expenseLog}
                        submitLabel="Simpan Perubahan"
                      />
                    }
                    editDescription="Perbarui data biaya untuk siklus budidaya ini."
                    editTitle="Edit Data Biaya"
                    itemId={expenseLog.id}
                    itemName={expenseLog.title}
                  />
                ) : (
                  <div className="flex items-start justify-end">
                    <Dialog>
                      <DialogTrigger
                        render={<Button className="gap-2" size="sm" type="button" variant="outline" />}
                      >
                        Detail
                      </DialogTrigger>
                      <DialogContent
                        className="w-full max-w-[calc(100%-2rem)] p-0 sm:max-w-2xl"
                        showCloseButton={false}
                      >
                        <DialogHeader className="border-border border-b p-5">
                          <p className="text-muted-foreground text-sm">Detail Biaya</p>
                          <DialogTitle>{expenseLog.title}</DialogTitle>
                          <DialogDescription>{formatDate(expenseLog.logDate)}</DialogDescription>
                        </DialogHeader>
                        <ExpenseLogDetailContent expenseLog={expenseLog} />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="font-semibold">Belum ada catatan biaya</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Tambahkan pencatatan biaya manual pertama untuk siklus ini.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  )
}
