import { Link } from 'react-router-dom'
import companyLogo from '../../assets/companylogo.png'

const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <img src={companyLogo} alt="Computing Yard" className="auth-card__logo" />
          {/* <p className="auth-card__title">Attendance System</p> */}
        </div>

        <div className="auth-card__body">
          <div className="auth-card__intro">
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>

          {children}
        </div>

        {footer && <div className="auth-card__footer">{footer}</div>}
      </div>
    </div>
  )
}

export const AuthLink = ({ to, children }) => (
  <Link to={to} className="auth-link">
    {children}
  </Link>
)

export default AuthLayout
