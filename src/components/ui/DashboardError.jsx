const DashboardError = ({ onRetry }) => {
  return (
    <div className="dashboard-error">
      <span className="dashboard-error__icon">⚠️</span>
      <h2>Failed to load data. Please try again.</h2>
      {onRetry && (
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}

export default DashboardError
