import { NavLink } from 'react-router-dom'
import companyLogo from '../../assets/companylogo.png'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/employees', label: 'Employees', icon: '👥' },
  { to: '/admin/departments', label: 'Departments', icon: '🏢' },
  { to: '/admin/attendance', label: 'Attendance', icon: '📅' },
  { to: '/admin/holidays', label: 'Holidays', icon: '🎉' },
  { to: '/admin/payslips', label: 'Payslips', icon: '💰' },
  { to: '/admin/reports', label: 'Reports', icon: '📈' },
  { to: '/admin/profile', label: 'Profile', icon: '👤' },
]

const employeeLinks = [
  { to: '/employee/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/employee/attendance/my', label: 'My Attendance', icon: '📅' },
  { to: '/employee/holidays', label: 'Holidays', icon: '🎉' },
  { to: '/employee/payslips', label: 'My Payslips', icon: '💰' },
  { to: '/employee/reports', label: 'My Reports', icon: '📈' },
  { to: '/employee/profile', label: 'Profile', icon: '👤' },
]

const Sidebar = ({ role, collapsed, mobileOpen }) => {
  const links = role === 'admin' ? adminLinks : employeeLinks

  return (
    <aside
      className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${
        mobileOpen ? 'sidebar--open' : ''
      }`}
    >
      <div className="sidebar__brand">
        <img src={companyLogo} alt="Computing Yard" className="sidebar__logo-img" />
        {!collapsed && <span className="sidebar__brand-title">Attendance System</span>}
      </div>

      <nav className="sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__icon">{link.icon}</span>
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
