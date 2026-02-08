export type MenuVariant = 'A' | 'B'

export type MenuTelemetryEntry = {
  variant: MenuVariant
  timeMs: number
  timestamp: string
}

const MENU_TELEMETRY_KEY = 'retro-neon-menu-ab-results'

export function readMenuTelemetry(): MenuTelemetryEntry[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(MENU_TELEMETRY_KEY)
    if (!rawValue) {
      return []
    }

    const parsed = JSON.parse(rawValue)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((entry): entry is MenuTelemetryEntry => {
      return (
        typeof entry === 'object' &&
        entry !== null &&
        (entry.variant === 'A' || entry.variant === 'B') &&
        typeof entry.timeMs === 'number' &&
        Number.isFinite(entry.timeMs) &&
        typeof entry.timestamp === 'string'
      )
    })
  } catch {
    return []
  }
}

export function appendMenuTelemetry(entry: MenuTelemetryEntry) {
  if (typeof window === 'undefined') {
    return
  }

  const current = readMenuTelemetry()
  current.push(entry)
  window.localStorage.setItem(MENU_TELEMETRY_KEY, JSON.stringify(current))
}

export function getMenuTelemetryAverages(entries: MenuTelemetryEntry[]) {
  const grouped = {
    A: entries.filter((entry) => entry.variant === 'A').map((entry) => entry.timeMs),
    B: entries.filter((entry) => entry.variant === 'B').map((entry) => entry.timeMs),
  }

  const average = (values: number[]) => {
    if (values.length === 0) {
      return null
    }

    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
  }

  return {
    A: average(grouped.A),
    B: average(grouped.B),
  }
}
