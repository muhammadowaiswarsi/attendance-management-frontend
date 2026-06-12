export const formatPercentage = (value) => {
  const num = Number(value ?? 0)
  return `${num.toFixed(1)}%`
}

export const getYearOptions = (count = 5) => {
  const current = new Date().getFullYear()
  return Array.from({ length: count }, (_, i) => current - i)
}

export const getDefaultMonthYear = () => {
  const now = new Date()
  return { month: now.getMonth() + 1, year: now.getFullYear() }
}

export const getRecentMonths = (count = 6) => {
  const now = new Date()
  const periods = []

  for (let i = 0; i < count; i += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    periods.push({ month: date.getMonth() + 1, year: date.getFullYear() })
  }

  return periods
}
