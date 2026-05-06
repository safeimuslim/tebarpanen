export function readText(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? ""
}

export function getProfileMessage(status?: string, error?: string) {
  if (status === "updated") {
    return {
      tone: "success",
      text: "Profile berhasil diperbarui.",
    }
  }

  if (!error) {
    return null
  }

  const messages: Record<string, string> = {
    required: "Nama, email, dan nomor HP wajib diisi.",
    password_mismatch: "Konfirmasi password baru tidak sesuai.",
    current_password_required: "Password saat ini wajib diisi.",
    current_password_invalid: "Password saat ini tidak sesuai.",
    user_not_found: "User tidak ditemukan.",
    duplicate: "Email atau nomor HP sudah digunakan user lain.",
    update_failed: "Profile gagal diperbarui.",
  }

  return {
    tone: "error",
    text: messages[error] ?? messages.update_failed,
  }
}

export function isPrismaUniqueError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  )
}
