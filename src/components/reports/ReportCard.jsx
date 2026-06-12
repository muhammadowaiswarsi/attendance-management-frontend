import { Link } from 'react-router-dom'

const ReportCard = ({
  icon,
  title,
  description,
  to,
  actionLabel = 'View Report',
  onAction,
  accent = 'primary',
}) => {
  const content = (
    <>
      <div className={`report-card__icon report-card__icon--${accent}`}>{icon}</div>
      <h3 className="report-card__title">{title}</h3>
      <p className="report-card__description">{description}</p>
      <span className="report-card__action">{actionLabel} →</span>
    </>
  )

  if (onAction) {
    return (
      <button type="button" className="report-card" onClick={onAction}>
        {content}
      </button>
    )
  }

  return (
    <Link to={to} className="report-card">
      {content}
    </Link>
  )
}

export default ReportCard
