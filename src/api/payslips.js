import api from './axios'

export const fromApiResponse = (row) => ({
  id: row.id,
  employeeId: row.employee_id,
  employeeName: row.employee_name,
  month: row.month,
  year: row.year,
  basicSalary: row.basic_salary,
  allowances: row.allowances,
  deductions: row.deductions,
  netSalary: row.net_salary,
  pdfPath: row.pdf_path,
  sentAt: row.sent_at,
  createdAt: row.created_at,
})

export const enrichWithEmployees = (payslips, employees = []) => {
  const map = Object.fromEntries(employees.map((e) => [e.id, e]))
  return payslips.map((p) => ({
    ...p,
    employeeCode: map[p.employeeId]?.employeeCode || '—',
    departmentName: map[p.employeeId]?.departmentName || '—',
    designation: map[p.employeeId]?.designation || '—',
  }))
}

export const getPayslips = async () => {
  const { data } = await api.get('/payslips')
  return data.map(fromApiResponse)
}

export const getPayslipById = async (id) => {
  const { data } = await api.get(`/payslips/${id}`)
  return fromApiResponse(data)
}

export const getMyPayslips = async () => {
  const { data } = await api.get('/payslips/my-payslips')
  return data.map(fromApiResponse)
}

export const createPayslip = async (form) => {
  const { data } = await api.post('/payslips', {
    employee_id: Number(form.employeeId),
    month: Number(form.month),
    year: Number(form.year),
    basic_salary: Number(form.basicSalary),
    allowances: Number(form.allowances || 0),
    deductions: Number(form.deductions || 0),
  })
  return fromApiResponse(data)
}

export const sendPayslipEmail = async (id) => {
  const { data } = await api.post(`/payslips/${id}/send-email`)
  return data
}

export const downloadPayslip = async (id, filename) => {
  const { data } = await api.get(`/payslips/download/${id}`, {
    responseType: 'blob',
  })
  const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `payslip-${id}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export const deletePayslip = async (id) => {
  const { data } = await api.delete(`/payslips/${id}`)
  return data
}
