"use client"

import { useActionState, useEffect, useRef } from "react"
import { Trash2 } from "lucide-react"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type DeleteConfirmButtonProps = {
  action: (
    previousState: ActionState,
    formData: FormData
  ) => Promise<ActionState>
  description: string
  id: string
  itemName: string
}

export function DeleteConfirmButton({
  action,
  description,
  id,
  itemName,
}: DeleteConfirmButtonProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [state, formAction] = useActionState(action, initialActionState)

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message)
      closeButtonRef.current?.click()
    }

    if (state.status === "error") {
      toast.error(state.message)
    }
  }, [state])

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button className="gap-2" size="sm" variant="destructive" />}>
        <Trash2 className="size-4" />
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2 className="size-5 text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>Hapus data?</AlertDialogTitle>
          <AlertDialogDescription>
            {description} <span className="font-medium text-foreground">{itemName}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={closeButtonRef}>Batal</AlertDialogCancel>
          <form action={formAction}>
            <input name="id" type="hidden" value={id} />
            <FormSubmitButton className="gap-2" pendingLabel="Menghapus..." type="submit" variant="destructive">
              <Trash2 className="size-4" />
              Hapus
            </FormSubmitButton>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
