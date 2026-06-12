const StatsCard = ({ icon, value, label, accent = 'primary' }) => {
  return (
    <div className={`stats-card stats-card--${accent}`}>
      <div className="stats-card__icon">{icon}</div>
      <div className="stats-card__content">
        <p className="stats-card__value">{value}</p>
        <p className="stats-card__label">{label}</p>
      </div>
    </div>
  )
}

export default StatsCard
