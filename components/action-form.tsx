"use client"

import { useActionState, useEffect, useRef } from "react"
import { toast } from "sonner"

import { type ActionState, initialActionState } from "@/app/lib/action-state"

type ActionFormProps = Omit<React.ComponentProps<"form">, "action"> & {
  action: (
    previousState: ActionState,
    formData: FormData
  ) => Promise<ActionState>
  closeTargetId?: string
  resetOnSuccess?: boolean
}

export function ActionForm({
  action,
  children,
  closeTargetId,
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

      if (closeTargetId) {
        closeTarget(closeTargetId)
      }
    }

    if (state.status === "error") {
      toast.error(state.message)
    }
  }, [closeTargetId, resetOnSuccess, state])

  return (
    <form ref={formRef} action={formAction} {...props}>
      {children}
    </form>
  )
}

function closeTarget(id: string) {
  const element = document.getElementById(id) as
    | (HTMLElement & { hidePopover?: () => void; click?: () => void })
    | null

  if (!element) {
    return
  }

  if (
    element.hasAttribute("popover") &&
    typeof element.hidePopover === "function"
  ) {
    element.hidePopover()
    return
  }

  element.click?.()
}
