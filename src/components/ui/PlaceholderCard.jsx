const PlaceholderCard = ({ title, description }) => {
  return (
    <div className="placeholder-card">
      <div className="placeholder-card__icon">📋</div>
      <h2>{title}</h2>
      <p>{description}</p>
      <span className="badge">Coming Soon</span>
    </div>
  )
}

export default PlaceholderCard
