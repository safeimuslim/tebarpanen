"use client"

import { useActionState, useEffect, useRef } from "react"
import { toast } from "sonner"

import { type ActionState, initialActionState } from "@/app/lib/action-state"

type ActionFormProps = Omit<React.ComponentProps<"form">, "action"> & {
  action: (
    previousState: ActionState,
    formData: FormData
  ) => Promise<ActionState>
  closePopoverId?: string
  resetOnSuccess?: boolean
}

export function ActionForm({
  action,
  children,
  closePopoverId,
  resetOnSuccess = false,
  ...props
}: ActionFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction] = useActionState(action, initialActionState)

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message)

      if (resetOnSuccess) {
        formRef.current?.reset()
      }

      if (closePopoverId) {
        hidePopover(closePopoverId)
      }
    }

    if (state.status === "error") {
      toast.error(state.message)
    }
  }, [closePopoverId, resetOnSuccess, state])

  return (
    <form ref={formRef} action={formAction} {...props}>
      {children}
    </form>
  )
}

function hidePopover(id: string) {
  const element = document.getElementById(id) as
    | (HTMLElement & { hidePopover?: () => void })
    | null

  element?.hidePopover?.()
}
