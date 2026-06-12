import StatsCard from '../dashboard/StatsCard'
import AttendanceProgress from './AttendanceProgress'

const CompanyReport = ({ data }) => {
  if (!data) return null

  return (
    <div className="report-results">
      <div className="report-results__header">
        <h3>Company Summary</h3>
        <span className="report-results__badge">Organization Overview</span>
      </div>

      <div className="stats-grid report-stats-grid">
        <StatsCard icon="👥" value={data.totalEmployees} label="Total Employees" accent="primary" />
        <StatsCard icon="✅" value={data.totalPresent} label="Total Present" accent="success" />
        <StatsCard icon="❌" value={data.totalAbsent} label="Total Absent" accent="danger" />
        <StatsCard icon="⏳" value={data.totalHalfDays} label="Total Half Days" accent="warning" />
        <StatsCard icon="🏖️" value={data.totalLeaves} label="Total Leaves" accent="accent" />
      </div>

      <AttendanceProgress
        percentage={data.overallAttendancePercentage}
        label="Overall Attendance"
      />
    </div>
  )
}

export default CompanyReport
