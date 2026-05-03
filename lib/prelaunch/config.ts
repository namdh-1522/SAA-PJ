export function parsePrelaunchEnd(iso: string | undefined): Date | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    console.warn('Invalid NEXT_PUBLIC_PRELAUNCH_END')
    return null
  }
  return d
}

export function isPrelaunchActive(cutoff: Date | null): boolean {
  if (!cutoff) return false
  return Date.now() < cutoff.getTime()
}
