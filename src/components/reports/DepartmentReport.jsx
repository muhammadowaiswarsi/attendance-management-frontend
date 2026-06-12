import StatsCard from '../dashboard/StatsCard'
import AttendanceProgress from './AttendanceProgress'

const DepartmentReport = ({ data }) => {
  if (!data) return null

  return (
    <div className="report-results">
      <div className="report-results__header">
        <h3>{data.departmentName}</h3>
        <span className="report-results__badge">Department Report</span>
      </div>

      <div className="stats-grid report-stats-grid report-stats-grid--three">
        <StatsCard
          icon="👥"
          value={data.totalEmployees}
          label="Total Employees"
          accent="primary"
        />
        <StatsCard
          icon="🏆"
          value={data.bestPerformingEmployee || '—'}
          label="Best Performing Employee"
          accent="success"
        />
      </div>

      <AttendanceProgress
        percentage={data.averageAttendancePercentage}
        label="Average Attendance"
      />
    </div>
  )
}

export default DepartmentReport
