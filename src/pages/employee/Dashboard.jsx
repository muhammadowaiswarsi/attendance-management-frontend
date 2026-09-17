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
import useCachedResource from '../../hooks/useCachedResource'
import { CACHE_KEYS } from '../../utils/pageCache'

const EmployeeDashboard = () => {
  const { user } = useAuth()
  const { data, loading, error, reload } = useCachedResource(
    CACHE_KEYS.employeeDashboard,
    getEmployeeDashboard
  )

  if (loading) {
    return <DashboardSkeleton variant="employee" />
  }

  if (error || !data) {
    return <DashboardError onRetry={reload} />
  }

  const {
    profile,
    attendanceSummary,
    recentAttendance,
    payslips,
    quickInfo,
  } = data

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
            {payslips.length > 0 && (
              <span className="dashboard-panel__meta">Latest 3</span>
            )}
          </div>
          <PayslipPreview payslips={payslips} />
        </div>
      </section>
    </div>
  )
}

export default EmployeeDashboard
