import StatsCard from '../dashboard/StatsCard'
import AttendanceProgress from './AttendanceProgress'

const MonthlyReport = ({ data }) => {
  if (!data) return null

  return (
    <div className="report-results">
      <div className="report-results__header">
        <h3>{data.employeeName}</h3>
        <span className="report-results__badge">Monthly Report</span>
      </div>

      <div className="stats-grid report-stats-grid">
        <StatsCard icon="📅" value={data.totalDays} label="Total Days" accent="primary" />
        <StatsCard icon="✅" value={data.presentDays} label="Present Days" accent="success" />
        <StatsCard icon="❌" value={data.absentDays} label="Absent Days" accent="danger" />
        <StatsCard icon="⏳" value={data.halfDays} label="Half Days" accent="warning" />
        <StatsCard icon="🏖️" value={data.leaveDays} label="Leave Days" accent="accent" />
      </div>

      <AttendanceProgress percentage={data.attendancePercentage} />
    </div>
  )
}

export default MonthlyReport
