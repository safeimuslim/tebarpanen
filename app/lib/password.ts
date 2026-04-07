import { scryptSync, timingSafeEqual } from "node:crypto"

export function verifyPassword(password: string, passwordHash: string) {
  const [algorithm, salt, hash] = passwordHash.split("$")

  if (algorithm !== "scrypt" || !salt || !hash) {
    return false
  }

  try {
    const expected = Buffer.from(hash, "hex")
    const actual = scryptSync(password, salt, expected.length)

    return timingSafeEqual(actual, expected)
  } catch {
    return false
  }
}
