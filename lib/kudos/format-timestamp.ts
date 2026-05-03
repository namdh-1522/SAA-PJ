/** Spotlight activity rail — e.g. `8:30 PM` (Figma sample `08:30PM`). */
export function formatKudosActivityTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
    .format(new Date(iso))
    .replace(/\s/g, '')
    .toUpperCase()
}

/** Matches Figma live board: `10:00 - 10/30/2025` (design-style — `--text-meta`). */
export function formatKudosTimestamp(iso: string): string {
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const DD = String(d.getDate()).padStart(2, '0')
  const MM = String(d.getMonth() + 1).padStart(2, '0')
  const YYYY = d.getFullYear()
  return `${hh}:${mm} - ${DD}/${MM}/${YYYY}`
}
