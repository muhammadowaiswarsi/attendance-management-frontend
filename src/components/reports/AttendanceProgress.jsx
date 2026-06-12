import { formatPercentage } from '../../utils/reports'

const AttendanceProgress = ({ percentage, label = 'Attendance' }) => {
  const value = Math.min(Math.max(Number(percentage) || 0, 0), 100)

  let tone = 'danger'
  if (value >= 90) tone = 'success'
  else if (value >= 75) tone = 'primary'
  else if (value >= 60) tone = 'warning'

  return (
    <div className="attendance-progress">
      <div className="attendance-progress__header">
        <span className="attendance-progress__label">{label}</span>
        <span className="attendance-progress__value">{formatPercentage(value)}</span>
      </div>
      <div className="attendance-progress__track">
        <div
          className={`attendance-progress__fill attendance-progress__fill--${tone}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default AttendanceProgress
