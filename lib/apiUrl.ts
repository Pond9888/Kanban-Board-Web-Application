// In mobile builds (Capacitor), API calls must use an absolute URL to the deployed backend.
// Set NEXT_PUBLIC_API_BASE_URL in .env.local for development or .env.production for mobile builds.
export function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  return `${base}${path}`
}
