export type ActionState = {
  status: "idle" | "success" | "error"
  message: string
}

export const initialActionState: ActionState = {
  status: "idle",
  message: "",
}

export function actionSuccess(message: string): ActionState {
  return {
    status: "success",
    message,
  }
}

export function actionError(message: string): ActionState {
  return {
    status: "error",
    message,
  }
}
