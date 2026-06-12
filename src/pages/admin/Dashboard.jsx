import { useCallback, useEffect, useState } from 'react'
import { getAdminDashboard } from '../../api/dashboard'
import AttendanceTable from '../../components/dashboard/AttendanceTable'
import QuickActions from '../../components/dashboard/QuickActions'
import RecentActivity from '../../components/dashboard/RecentActivity'
import StatsCard from '../../components/dashboard/StatsCard'
import DashboardError from '../../components/ui/DashboardError'
import DashboardSkeleton from '../../components/ui/DashboardSkeleton'
import PageHeader from '../../components/ui/PageHeader'
import { useAuth } from '../../context/AuthContext'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [stats, setStats] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [activity, setActivity] = useState([])

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await getAdminDashboard()
      setStats(data.stats)
      setAttendance(data.todayAttendance)
      setActivity(data.recentActivity)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  if (loading) {
    return <DashboardSkeleton variant="admin" />
  }

  if (error) {
    return <DashboardError onRetry={loadDashboard} />
  }

  return (
    <div className="dashboard">
      <PageHeader
        title={`Welcome, ${user?.full_name || 'Admin'}`}
        subtitle="Here's what's happening in your organization today"
      />

      <section className="stats-grid">
        <StatsCard icon="👥" value={stats.totalEmployees} label="Total Employees" accent="primary" />
        <StatsCard icon="✅" value={stats.presentToday} label="Present Today" accent="success" />
        <StatsCard icon="❌" value={stats.absentToday} label="Absent Today" accent="danger" />
        <StatsCard icon="⏳" value={stats.halfDayToday} label="Half Day Today" accent="warning" />
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel dashboard-panel--wide">
          <div className="dashboard-panel__header">
            <h3>Today&apos;s Attendance</h3>
            <span className="dashboard-panel__meta">{attendance.length} records</span>
          </div>
          <AttendanceTable records={attendance} />
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-panel__header">
            <h3>Quick Actions</h3>
          </div>
          <QuickActions />
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-panel__header">
            <h3>Recent Activity</h3>
          </div>
          <RecentActivity activities={activity} />
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard
