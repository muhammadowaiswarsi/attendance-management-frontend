const QuickInfoPanel = ({ info }) => {
  if (!info) return null

  return (
    <div className="quick-info">
      <div className="quick-info__item">
        <span className="quick-info__label">Total Leaves</span>
        <span className="quick-info__value">{info.totalLeaves}</span>
        <span className="quick-info__hint">Annual allowance</span>
      </div>
      <div className="quick-info__item">
        <span className="quick-info__label">This Month Attendance</span>
        <span className="quick-info__value">{info.thisMonthAttendance}%</span>
        <span className="quick-info__hint">Current month</span>
      </div>
      <div className="quick-info__item">
        <span className="quick-info__label">Last Login</span>
        <span className="quick-info__value quick-info__value--sm">{info.lastLogin}</span>
      </div>
    </div>
  )
}

export default QuickInfoPanel
