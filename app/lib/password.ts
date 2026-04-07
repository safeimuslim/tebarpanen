import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"

const keyLength = 64

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, keyLength).toString("hex")

  return `scrypt$${salt}$${hash}`
}

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
