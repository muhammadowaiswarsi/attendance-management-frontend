import { getEmployees } from './employees'
import api from './axios'
import { getRecentMonths } from '../utils/reports'

const fromMonthlyReport = (row) => ({
  employeeName: row.employee_name,
  totalDays: row.total_days,
  presentDays: row.present_days,
  absentDays: row.absent_days,
  halfDays: row.half_days,
  leaveDays: row.leave_days,
  attendancePercentage: row.attendance_percentage,
})

const fromCompanyReport = (row) => ({
  totalEmployees: row.total_employees,
  totalPresent: row.total_present,
  totalAbsent: row.total_absent,
  totalHalfDays: row.total_half_days,
  totalLeaves: row.total_leaves,
  overallAttendancePercentage: row.overall_attendance_percentage,
})

const fromDepartmentReport = (row) => ({
  departmentName: row.department_name,
  totalEmployees: row.total_employees,
  averageAttendancePercentage: row.average_attendance_percentage,
  bestPerformingEmployee: row.best_performing_employee,
})

export const getMonthlyReport = async (employeeId, month, year) => {
  const { data } = await api.get('/reports/monthly', {
    params: { employee_id: employeeId, month, year },
  })
  return fromMonthlyReport(data)
}

export const getCompanyReport = async (month, year) => {
  const { data } = await api.get('/reports/company', {
    params: { month, year },
  })
  return fromCompanyReport(data)
}

export const getDepartmentReport = async (departmentId, month, year) => {
  const { data } = await api.get('/reports/department', {
    params: { department_id: departmentId, month, year },
  })
  return fromDepartmentReport(data)
}

export const exportReportCSV = async (month, year) => {
  const { data } = await api.get('/reports/export/monthly', {
    params: { month, year },
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([data], { type: 'text/csv' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `report_${year}_${String(month).padStart(2, '0')}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

const resolveEmployeeByEmail = async (email) => {
  const employees = await getEmployees(email)
  return (
    employees.find((employee) => employee.email.toLowerCase() === email.toLowerCase()) ||
    employees[0] ||
    null
  )
}

export const getEmployeeReports = async (userEmail) => {
  const employee = await resolveEmployeeByEmail(userEmail)
  if (!employee) {
    throw new Error('Employee profile not found')
  }

  const periods = getRecentMonths(6)
  const reports = await Promise.all(
    periods.map(async ({ month, year }) => {
      const report = await getMonthlyReport(employee.id, month, year)
      return { month, year, ...report }
    })
  )

  const current = reports[0]

  return {
    employee,
    summary: {
      presentDays: current.presentDays,
      absentDays: current.absentDays,
      halfDays: current.halfDays,
      attendancePercentage: current.attendancePercentage,
    },
    history: reports.map(({ month, year, attendancePercentage }) => ({
      month,
      year,
      attendancePercentage,
    })),
  }
}
