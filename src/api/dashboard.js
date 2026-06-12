import api from './axios'
import { formatRelativeTime } from '../utils/time'

const fromStats = (row) => ({
  totalEmployees: row.total_employees,
  presentToday: row.present_today,
  absentToday: row.absent_today,
  halfDayToday: row.half_day_today,
  pendingPayslips: row.pending_payslips,
})

const fromTodayAttendance = (row) => ({
  id: row.id,
  employeeName: row.employee_name,
  department: row.department,
  status: row.status,
})

const fromPayslipSummary = (row) => ({
  totalThisMonth: row.total_this_month,
  sent: row.sent,
  pending: row.pending,
})

const fromRecentActivity = (row) => ({
  id: row.id,
  message: row.message,
  time: formatRelativeTime(row.occurred_at),
})

const fromAdminDashboard = (data) => ({
  stats: fromStats(data.stats),
  todayAttendance: data.today_attendance.map(fromTodayAttendance),
  payslipSummary: fromPayslipSummary(data.payslip_summary),
  recentActivity: data.recent_activity.map(fromRecentActivity),
})

export const getAdminDashboard = async () => {
  const { data } = await api.get('/dashboard/admin')
  return fromAdminDashboard(data)
}

export const getDashboardStats = async () => {
  const dashboard = await getAdminDashboard()
  return dashboard.stats
}

export const getTodayAttendance = async () => {
  const { data } = await api.get('/attendance/today')
  return data.map(fromTodayAttendance)
}

export const getPayslipSummary = async () => {
  const dashboard = await getAdminDashboard()
  return dashboard.payslipSummary
}

export const getRecentActivity = async () => {
  const dashboard = await getAdminDashboard()
  return dashboard.recentActivity
}
