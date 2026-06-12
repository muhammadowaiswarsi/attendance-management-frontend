import { useNavigate } from 'react-router-dom'

const actions = [
  { label: 'Add Employee', icon: '👤', path: '/admin/employees', variant: 'primary' },
  { label: 'Mark Attendance', icon: '📅', path: '/admin/attendance', variant: 'accent' },
  { label: 'Create Department', icon: '🏢', path: '/admin/departments', variant: 'outline' },
  { label: 'Generate Report', icon: '📈', path: '/admin/reports', variant: 'outline' },
]

const QuickActions = () => {
  const navigate = useNavigate()

  return (
    <div className="quick-actions">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className={`quick-actions__btn quick-actions__btn--${action.variant}`}
          onClick={() => navigate(action.path)}
        >
          <span className="quick-actions__icon">{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  )
}

export default QuickActions
