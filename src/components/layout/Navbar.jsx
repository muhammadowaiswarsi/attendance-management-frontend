import { useAuth } from '../../context/AuthContext'

const Navbar = ({ onMenuToggle }) => {
  const { user, logout, role } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button type="button" className="navbar__menu-btn" onClick={onMenuToggle}>
          ☰
        </button>
        <div>
          <h2>{role === 'admin' ? 'Admin Panel' : 'Employee Portal'}</h2>
          <p>Welcome back, {user?.full_name}</p>
        </div>
      </div>

      <div className="navbar__right">
        <span className="role-badge">{role}</span>
        <button type="button" className="btn btn--outline" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
