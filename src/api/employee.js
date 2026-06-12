import api from './axios'

const fromProfile = (row) => ({
  fullName: row.full_name,
  employeeCode: row.employee_code,
  department: row.department,
  designation: row.designation,
  isActive: row.is_active,
})

const fromAttendanceSummary = (row) => ({
  totalDays: row.total_days,
  presentDays: row.present_days,
  absentDays: row.absent_days,
  halfDays: row.half_days,
  attendancePercentage: row.attendance_percentage,
})

const fromRecentAttendance = (row) => ({
  id: row.id,
  date: row.date,
  status: row.status,
})

const fromPayslipPreview = (row) => ({
  id: row.id,
  month: row.month,
  year: row.year,
  netSalary: row.net_salary,
  status: row.status,
})

const fromQuickInfo = (row) => ({
  totalLeaves: row.total_leaves,
  thisMonthAttendance: row.this_month_attendance,
  lastLogin: row.last_login || '—',
})

const fromEmployeeDashboard = (data) => ({
  profile: fromProfile(data.profile),
  attendanceSummary: fromAttendanceSummary(data.attendance_summary),
  recentAttendance: data.recent_attendance.map(fromRecentAttendance),
  payslips: data.payslips.map(fromPayslipPreview),
  quickInfo: fromQuickInfo(data.quick_info),
})

export const getEmployeeDashboard = async () => {
  const { data } = await api.get('/dashboard/employee')
  return fromEmployeeDashboard(data)
}

export const getMyProfile = async () => {
  const dashboard = await getEmployeeDashboard()
  return dashboard.profile
}

export const getMyAttendance = async () => {
  const dashboard = await getEmployeeDashboard()
  return {
    summary: dashboard.attendanceSummary,
    recent: dashboard.recentAttendance,
  }
}

export const getMyPayslips = async () => {
  const dashboard = await getEmployeeDashboard()
  return dashboard.payslips
}

export const getMyQuickInfo = async () => {
  const dashboard = await getEmployeeDashboard()
  return dashboard.quickInfo
}
