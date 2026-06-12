const PKT_TIMEZONE = 'Asia/Karachi'

export const parseApiDateTime = (value) => {
  if (!value) return null
  if (value instanceof Date) return value

  const raw = String(value).trim()
  const hasTimezone = /([zZ]|[+-]\d{2}:\d{2})$/.test(raw)
  const normalized = hasTimezone ? raw : `${raw.replace(' ', 'T')}Z`
  const date = new Date(normalized)

  return Number.isNaN(date.getTime()) ? null : date
}

export const formatRelativeTime = (value) => {
  const date = parseApiDateTime(value)
  if (!date) return '—'

  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'Just now'
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`
  if (diffDay === 1) return 'Yesterday'
  if (diffDay < 7) return `${diffDay} days ago`

  return date.toLocaleDateString('en-PK', {
    timeZone: PKT_TIMEZONE,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const formatPktDateTime = (value) => {
  const date = parseApiDateTime(value)
  if (!date) return '—'

  return date.toLocaleString('en-PK', {
    timeZone: PKT_TIMEZONE,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
