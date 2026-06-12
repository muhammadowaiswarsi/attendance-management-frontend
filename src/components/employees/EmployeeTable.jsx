import { canResendInvitation } from '../../utils/employees'

const EmployeeTable = ({
  employees = [],
  loading,
  resendLoadingId = null,
  deleteLoadingId = null,
  onView,
  onEdit,
  onToggleStatus,
  onResendInvite,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="employee-table-loading">
        <div className="spinner" />
        <p>Loading employees...</p>
      </div>
    )
  }

  if (employees.length === 0) {
    return (
      <div className="employee-empty">
        <span className="employee-empty__icon">👥</span>
        <h3>No employees found</h3>
        <p>Try adjusting your search or filters, or add a new employee.</p>
      </div>
    )
  }

  return (
    <>
      <div className="employee-table-wrap">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee Code</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => {
              const showResend = canResendInvitation(employee)
              const isResending = resendLoadingId === employee.id
              const isDeleting = deleteLoadingId === employee.id

              return (
                <tr key={employee.id}>
                  <td data-label="Code">{employee.employeeCode}</td>
                  <td data-label="Name">{employee.fullName}</td>
                  <td data-label="Email">{employee.email}</td>
                  <td data-label="Department">{employee.departmentName}</td>
                  <td data-label="Designation">{employee.designation || '—'}</td>
                  <td data-label="Status">
                    <span
                      className={`badge ${
                        employee.isActive ? 'badge--success' : 'badge--danger'
                      }`}
                    >
                      {employee.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="employee-actions">
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        onClick={() => onView(employee)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        onClick={() => onEdit(employee)}
                      >
                        Edit
                      </button>
                      {showResend && (
                        <button
                          type="button"
                          className="btn btn--outline btn--sm employee-actions__resend"
                          onClick={() => onResendInvite(employee)}
                          disabled={isResending}
                        >
                          {isResending ? 'Sending...' : 'Resend Invite'}
                        </button>
                      )}
                      <button
                        type="button"
                        className={`btn btn--sm ${
                          employee.isActive ? 'btn--outline-danger' : 'btn--outline-success'
                        }`}
                        onClick={() => onToggleStatus(employee)}
                      >
                        {employee.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        className="btn btn--icon-danger btn--sm"
                        onClick={() => onDelete(employee)}
                        disabled={isDeleting}
                        aria-label={`Delete ${employee.fullName}`}
                        title="Delete employee"
                      >
                        {isDeleting ? '…' : '🗑️'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="employee-cards">
        {employees.map((employee) => {
          const showResend = canResendInvitation(employee)
          const isResending = resendLoadingId === employee.id
          const isDeleting = deleteLoadingId === employee.id

          return (
            <div key={employee.id} className="employee-card">
              <div className="employee-card__header">
                <div>
                  <h4>{employee.fullName}</h4>
                  <p>{employee.employeeCode}</p>
                </div>
                <span
                  className={`badge ${
                    employee.isActive ? 'badge--success' : 'badge--danger'
                  }`}
                >
                  {employee.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="employee-card__body">
                <p><span>Email</span>{employee.email}</p>
                <p><span>Department</span>{employee.departmentName}</p>
                <p><span>Designation</span>{employee.designation || '—'}</p>
              </div>
              <div className="employee-card__actions">
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => onView(employee)}>
                  View
                </button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => onEdit(employee)}>
                  Edit
                </button>
                {showResend && (
                  <button
                    type="button"
                    className="btn btn--outline btn--sm employee-actions__resend"
                    onClick={() => onResendInvite(employee)}
                    disabled={isResending}
                  >
                    {isResending ? 'Sending...' : 'Resend Invite'}
                  </button>
                )}
                <button
                  type="button"
                  className={`btn btn--sm ${
                    employee.isActive ? 'btn--outline-danger' : 'btn--outline-success'
                  }`}
                  onClick={() => onToggleStatus(employee)}
                >
                  {employee.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  type="button"
                  className="btn btn--icon-danger btn--sm"
                  onClick={() => onDelete(employee)}
                  disabled={isDeleting}
                  aria-label={`Delete ${employee.fullName}`}
                  title="Delete employee"
                >
                  {isDeleting ? '…' : '🗑️'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default EmployeeTable
