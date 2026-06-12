const items = [
  { key: 'totalDays', label: 'Total Days', icon: '📅', accent: 'primary' },
  { key: 'presentDays', label: 'Present Days', icon: '✅', accent: 'success' },
  { key: 'absentDays', label: 'Absent Days', icon: '❌', accent: 'danger' },
  { key: 'halfDays', label: 'Half Days', icon: '⏳', accent: 'warning' },
  { key: 'attendancePercentage', label: 'Attendance %', icon: '📊', accent: 'accent', suffix: '%' },
]

const AttendanceSummary = ({ summary }) => {
  if (!summary) return null

  return (
    <div className="employee-stats-grid">
      {items.map((item) => (
        <div key={item.key} className={`employee-stat-card employee-stat-card--${item.accent}`}>
          <span className="employee-stat-card__icon">{item.icon}</span>
          <div>
            <p className="employee-stat-card__value">
              {summary[item.key]}
              {item.suffix || ''}
            </p>
            <p className="employee-stat-card__label">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AttendanceSummary
