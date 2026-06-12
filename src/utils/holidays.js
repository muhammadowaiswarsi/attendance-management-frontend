export const formatHolidayDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatHolidayDateShort = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(`${dateStr}T00:00:00`)
  return {
    day: date.getDate(),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
  }
}

export const getYearOptions = (count = 5) => {
  const current = new Date().getFullYear()
  return Array.from({ length: count }, (_, index) => current - 1 + index)
}

export const getUpcomingHolidays = (holidays, limit = 4) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return holidays
    .filter((holiday) => new Date(`${holiday.date}T00:00:00`) >= today)
    .sort((a, b) => new Date(`${a.date}T00:00:00`) - new Date(`${b.date}T00:00:00`))
    .slice(0, limit)
}

export const sortHolidaysByDate = (holidays) =>
  [...holidays].sort(
    (a, b) => new Date(`${a.date}T00:00:00`) - new Date(`${b.date}T00:00:00`)
  )
