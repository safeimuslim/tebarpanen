export function getSiteUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    "http://localhost:3000"

  const normalizedUrl = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`

  return new URL(normalizedUrl)
}
