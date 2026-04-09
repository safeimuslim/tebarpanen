"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { type ActionState, initialActionState } from "@/app/lib/action-state"
import { FormSubmitButton } from "@/components/form-submit-button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

type CrudRowActionsProps = {
  deleteAction: (
    previousState: ActionState,
    formData: FormData
  ) => Promise<ActionState>
  deleteDescription: string
  detailContent: React.ReactNode
  detailDescription?: string
  detailTitle: string
  editContent: React.ReactNode
  editDescription?: string
  editTitle: string
  itemId: string
  itemName: string
}

export function CrudRowActions({
  deleteAction,
  deleteDescription,
  detailContent,
  detailDescription,
  detailTitle,
  editContent,
  editDescription,
  editTitle,
  itemId,
  itemName,
}: CrudRowActionsProps) {
  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const closeDeleteRef = useRef<HTMLButtonElement>(null)
  const [deleteState, deleteFormAction] = useActionState(
    deleteAction,
    initialActionState
  )

  useEffect(() => {
    if (deleteState.status === "success") {
      toast.success(deleteState.message)
      closeDeleteRef.current?.click()
    }

    if (deleteState.status === "error") {
      toast.error(deleteState.message)
    }
  }, [deleteState])

  return (
    <>
      <div className="hidden flex-wrap items-start gap-2 lg:justify-end sm:flex">
        <Button className="gap-2" onClick={() => setDetailOpen(true)} size="sm" type="button" variant="outline">
          <Eye className="size-4" />
          Detail
        </Button>
        <Button className="gap-2" onClick={() => setEditOpen(true)} size="sm" type="button" variant="outline">
          <Pencil className="size-4" />
          Edit
        </Button>
        <Button className="gap-2" onClick={() => setDeleteOpen(true)} size="sm" type="button" variant="destructive">
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>

      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button size="icon-sm" type="button" variant="outline" />}
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Aksi</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setDetailOpen(true)}>
              <Eye className="size-4" />
              Detail
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Pencil className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog onOpenChange={setDetailOpen} open={detailOpen}>
        <DialogContent
          className="w-full max-w-[calc(100%-2rem)] p-0 sm:max-w-2xl"
          showCloseButton={false}
        >
          <DialogHeader className="border-border border-b p-5">
            <p className="text-muted-foreground text-sm">Detail Data</p>
            <DialogTitle>{detailTitle}</DialogTitle>
            {detailDescription ? (
              <DialogDescription>{detailDescription}</DialogDescription>
            ) : null}
          </DialogHeader>
          {detailContent}
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setEditOpen} open={editOpen}>
        <DialogContent
          className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto p-0 sm:max-w-3xl"
          showCloseButton={false}
        >
          <DialogHeader className="border-border border-b p-5">
            <p className="text-muted-foreground text-sm">Form Master Data</p>
            <DialogTitle>{editTitle}</DialogTitle>
            {editDescription ? (
              <DialogDescription>{editDescription}</DialogDescription>
            ) : null}
          </DialogHeader>
          {editContent}
        </DialogContent>
      </Dialog>

      <AlertDialog onOpenChange={setDeleteOpen} open={deleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash2 className="size-5 text-destructive" />
            </AlertDialogMedia>
            <AlertDialogTitle>Hapus data?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDescription}{" "}
              <span className="font-medium text-foreground">{itemName}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel ref={closeDeleteRef}>Batal</AlertDialogCancel>
            <form action={deleteFormAction}>
              <input name="id" type="hidden" value={itemId} />
              <FormSubmitButton
                className="gap-2"
                pendingLabel="Menghapus..."
                type="submit"
                variant="destructive"
              >
                <Trash2 className="size-4" />
                Hapus
              </FormSubmitButton>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
