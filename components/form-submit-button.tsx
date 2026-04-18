"use client"

import { Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"

type FormSubmitButtonProps = React.ComponentProps<typeof Button> & {
  isPending?: boolean
  pendingLabel?: string
}

export function FormSubmitButton({
  children,
  isPending = false,
  pendingLabel,
  disabled,
  ...props
}: FormSubmitButtonProps) {
  const { pending: formPending } = useFormStatus()
  const pending = formPending || isPending

  return (
    <Button disabled={pending || disabled} {...props}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {pendingLabel ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
