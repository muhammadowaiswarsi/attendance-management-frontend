import { Link } from 'react-router-dom'

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const EmployeeDetails = ({ employee, open, onClose }) => {
  if (!open || !employee) return null

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="employee-drawer">
        <div className="employee-drawer__header">
          <h2>Employee Details</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="employee-drawer__profile">
          <div className="employee-drawer__avatar">
            {employee.fullName?.charAt(0) || 'E'}
          </div>
          <div>
            <h3>{employee.fullName}</h3>
            <p>{employee.employeeCode}</p>
            <span
              className={`badge ${
                employee.isActive ? 'badge--success' : 'badge--danger'
              }`}
            >
              {employee.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="employee-drawer__section">
          <h4>Profile Information</h4>
          <dl className="detail-list">
            <div>
              <dt>Email</dt>
              <dd>{employee.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{employee.phoneNumber || '—'}</dd>
            </div>
            <div>
              <dt>Designation</dt>
              <dd>{employee.designation || '—'}</dd>
            </div>
            <div>
              <dt>Joining Date</dt>
              <dd>{formatDate(employee.joiningDate)}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{employee.address || '—'}</dd>
            </div>
          </dl>
        </div>

        <div className="employee-drawer__section">
          <h4>Department</h4>
          <p className="employee-drawer__dept">{employee.departmentName}</p>
        </div>

        <div className="employee-drawer__section">
          <h4>Quick Links</h4>
          <div className="employee-drawer__links">
            <Link
              to={`/admin/attendance?employee=${employee.id}`}
              className="employee-drawer__link"
              onClick={onClose}
            >
              📅 View Attendance
            </Link>
            <Link
              to={`/admin/payslips?employee=${employee.id}`}
              className="employee-drawer__link"
              onClick={onClose}
            >
              💰 View Payslips
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}

export default EmployeeDetails
