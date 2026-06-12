export const STATUS_BADGE_CLASS = {
  Present: 'badge badge--success',
  Absent: 'badge badge--danger',
  'Half Day': 'badge badge--warning',
  'On Leave': 'badge badge--info',
  Leave: 'badge badge--info',
  Holiday: 'badge badge--muted',
}

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const todayISO = () => new Date().toISOString().split('T')[0]

export const paginate = (items, page, pageSize) => {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export const filterByMonth = (records, month, year) => {
  return records.filter((record) => {
    const date = new Date(record.attendanceDate)
    return date.getMonth() + 1 === Number(month) && date.getFullYear() === Number(year)
  })
}
