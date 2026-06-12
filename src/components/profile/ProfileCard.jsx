import { formatProfileDate, formatRoleLabel } from '../../utils/profile'

const ProfileCard = ({ profile }) => {
  if (!profile) return null

  return (
    <div className="account-profile">
      <div className="account-profile__hero">
        <div className="account-profile__avatar">
          {profile.fullName?.charAt(0) || 'U'}
        </div>
        <div>
          <h2>{profile.fullName}</h2>
          <p>{profile.email}</p>
          <div className="account-profile__badges">
            <span className="role-badge">{formatRoleLabel(profile.role)}</span>
            <span className={`badge ${profile.isActive ? 'badge--success' : 'badge--danger'}`}>
              {profile.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="account-profile__sections">
        <section className="account-profile__section">
          <h3>Personal Information</h3>
          <dl className="account-profile__grid">
            <div>
              <dt>Full Name</dt>
              <dd>{profile.fullName || '—'}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{profile.email || '—'}</dd>
            </div>
            <div>
              <dt>Employee Code</dt>
              <dd>{profile.employeeCode || '—'}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{profile.departmentName || '—'}</dd>
            </div>
            <div>
              <dt>Designation</dt>
              <dd>{profile.designation || '—'}</dd>
            </div>
            <div>
              <dt>Joining Date</dt>
              <dd>{formatProfileDate(profile.joiningDate)}</dd>
            </div>
          </dl>
        </section>

        <section className="account-profile__section">
          <h3>Contact Information</h3>
          <dl className="account-profile__grid">
            <div>
              <dt>Phone Number</dt>
              <dd>{profile.phoneNumber || '—'}</dd>
            </div>
            <div className="account-profile__full-width">
              <dt>Address</dt>
              <dd>{profile.address || '—'}</dd>
            </div>
          </dl>
        </section>

        <section className="account-profile__section">
          <h3>Account Information</h3>
          <dl className="account-profile__grid">
            <div>
              <dt>Role</dt>
              <dd>{formatRoleLabel(profile.role)}</dd>
            </div>
            <div>
              <dt>Account Status</dt>
              <dd>{profile.isActive ? 'Active' : 'Inactive'}</dd>
            </div>
            <div>
              <dt>Last Login</dt>
              <dd>{profile.lastLogin || 'Never'}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  )
}

export default ProfileCard
