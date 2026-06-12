export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const MONTH_OPTIONS = MONTH_NAMES.map((name, index) => ({
  value: index + 1,
  label: name,
}))

export const formatCurrency = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`

export const calcNetSalary = (basic, allowances, deductions) =>
  Number(basic || 0) + Number(allowances || 0) - Number(deductions || 0)

export const formatPeriod = (month, year) =>
  `${MONTH_NAMES[month - 1] || month} ${year}`

export const formatPayslipMonth = (month, year) =>
  `${MONTH_NAMES[month - 1] || month}-${year}`

export const formatAmount = (amount) => {
  const value = Number(amount || 0)
  if (!value) return '-'
  return value.toLocaleString('en-PK', { maximumFractionDigits: 0 })
}

export const formatPayslipNumber = (id) => String(id).padStart(5, '0')

export const getPayslipStatus = (sentAt) => (sentAt ? 'Sent' : 'Not Sent')

export const paginate = (items, page, pageSize) => {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}
