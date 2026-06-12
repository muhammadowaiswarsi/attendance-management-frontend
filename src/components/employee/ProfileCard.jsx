const ProfileCard = ({ profile }) => {
  if (!profile) return null

  return (
    <div className="profile-summary-card">
      <div className="profile-summary-card__avatar">
        {profile.fullName?.charAt(0) || 'E'}
      </div>
      <div className="profile-summary-card__info">
        <h2>{profile.fullName}</h2>
        <p className="profile-summary-card__code">{profile.employeeCode}</p>
        <div className="profile-summary-card__meta">
          <div>
            <span>Department</span>
            <strong>{profile.department}</strong>
          </div>
          <div>
            <span>Designation</span>
            <strong>{profile.designation}</strong>
          </div>
        </div>
        <span className={`badge ${profile.isActive ? 'badge--success' : 'badge--danger'}`}>
          {profile.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  )
}

export default ProfileCard
