import { useCallback, useEffect, useState } from 'react'
import { getEmployeeDashboard } from '../../api/employee'
import AttendanceSummary from '../../components/employee/AttendanceSummary'
import PayslipPreview from '../../components/employee/PayslipPreview'
import ProfileCard from '../../components/employee/ProfileCard'
import QuickInfoPanel from '../../components/employee/QuickInfoPanel'
import RecentAttendance from '../../components/employee/RecentAttendance'
import DashboardError from '../../components/ui/DashboardError'
import DashboardSkeleton from '../../components/ui/DashboardSkeleton'
import PageHeader from '../../components/ui/PageHeader'
import { useAuth } from '../../context/AuthContext'

const EmployeeDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [profile, setProfile] = useState(null)
  const [attendanceSummary, setAttendanceSummary] = useState(null)
  const [recentAttendance, setRecentAttendance] = useState([])
  const [payslips, setPayslips] = useState([])
  const [quickInfo, setQuickInfo] = useState(null)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await getEmployeeDashboard()
      setProfile(data.profile)
      setAttendanceSummary(data.attendanceSummary)
      setRecentAttendance(data.recentAttendance)
      setPayslips(data.payslips)
      setQuickInfo(data.quickInfo)
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
    return <DashboardSkeleton variant="employee" />
  }

  if (error) {
    return <DashboardError onRetry={loadDashboard} />
  }

  return (
    <div className="dashboard employee-dashboard">
      <PageHeader
        title={`Welcome, ${user?.full_name || profile?.fullName || 'Employee'}`}
        subtitle="Your personal attendance overview"
      />

      <section className="employee-dashboard__top">
        <ProfileCard profile={profile} />
        <div className="dashboard-panel">
          <div className="dashboard-panel__header">
            <h3>Quick Info</h3>
          </div>
          <QuickInfoPanel info={quickInfo} />
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-panel__header">
          <h3>My Attendance Summary</h3>
          <span className="dashboard-panel__meta">This month</span>
        </div>
        {attendanceSummary ? (
          <AttendanceSummary summary={attendanceSummary} />
        ) : (
          <div className="dashboard-table__empty">No attendance data for this month.</div>
        )}
      </section>

      <section className="employee-dashboard__grid">
        <div className="dashboard-panel">
          <div className="dashboard-panel__header">
            <h3>Recent Attendance</h3>
          </div>
          <RecentAttendance records={recentAttendance} />
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-panel__header">
            <h3>My Payslips</h3>
            <span className="dashboard-panel__meta">Latest 3</span>
          </div>
          <PayslipPreview payslips={payslips} />
        </div>
      </section>
    </div>
  )
}

export default EmployeeDashboard
