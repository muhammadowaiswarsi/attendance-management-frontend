const DashboardSkeleton = ({ variant = 'admin' }) => {
  if (variant === 'employee') {
    return (
      <div className="dashboard dashboard-skeleton">
        <div className="dashboard-skeleton__header">
          <div className="dashboard-skeleton__line dashboard-skeleton__line--title" />
          <div className="dashboard-skeleton__line dashboard-skeleton__line--subtitle" />
        </div>

        <div className="employee-dashboard__top">
          <div className="dashboard-skeleton__card dashboard-skeleton__card--profile" />
          <div className="dashboard-skeleton__card dashboard-skeleton__card--panel" />
        </div>

        <div className="dashboard-skeleton__card dashboard-skeleton__card--wide" />

        <div className="employee-dashboard__grid">
          <div className="dashboard-skeleton__card dashboard-skeleton__card--panel" />
          <div className="dashboard-skeleton__card dashboard-skeleton__card--panel" />
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard dashboard-skeleton">
      <div className="dashboard-skeleton__header">
        <div className="dashboard-skeleton__line dashboard-skeleton__line--title" />
        <div className="dashboard-skeleton__line dashboard-skeleton__line--subtitle" />
      </div>

      <div className="stats-grid">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="dashboard-skeleton__stat" />
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-skeleton__card dashboard-skeleton__card--wide" />
        <div className="dashboard-skeleton__card dashboard-skeleton__card--panel" />
        <div className="dashboard-skeleton__card dashboard-skeleton__card--panel" />
      </div>
    </div>
  )
}

export default DashboardSkeleton
