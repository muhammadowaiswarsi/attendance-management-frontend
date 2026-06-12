const RecentActivity = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <div className="dashboard-table__empty dashboard-table__empty--panel">
        No recent activity yet.
      </div>
    )
  }

  return (
    <ul className="activity-list">
      {activities.map((item) => (
        <li key={item.id} className="activity-list__item">
          <span className="activity-list__dot" />
          <div className="activity-list__content">
            <p>{item.message}</p>
            <span>{item.time}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default RecentActivity
