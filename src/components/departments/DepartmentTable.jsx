import { formatDepartmentDate } from '../../utils/departments'

const DepartmentTable = ({
  departments = [],
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="department-table-loading">
        <div className="spinner" />
        <p>Loading departments...</p>
      </div>
    )
  }

  if (departments.length === 0) {
    return (
      <div className="department-empty">
        <span className="department-empty__icon">🏢</span>
        <h3>No departments found</h3>
        <p>Try adjusting your search or add a new department.</p>
      </div>
    )
  }

  return (
    <>
      <div className="department-table-wrap">
        <table className="department-table">
          <thead>
            <tr>
              <th>Department Name</th>
              <th>Description</th>
              <th>Total Employees</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department.id}>
                <td data-label="Name">{department.name}</td>
                <td data-label="Description">{department.description || '—'}</td>
                <td data-label="Employees">{department.totalEmployees ?? 0}</td>
                <td data-label="Created">{formatDepartmentDate(department.createdAt)}</td>
                <td data-label="Actions">
                  <div className="department-actions">
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => onEdit(department)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn--outline-danger btn--sm"
                      onClick={() => onDelete(department)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="department-cards">
        {departments.map((department) => (
          <div key={department.id} className="department-card">
            <div className="department-card__header">
              <div>
                <h4>{department.name}</h4>
                <p>{department.totalEmployees ?? 0} employees</p>
              </div>
              <span className="badge badge--info">
                {formatDepartmentDate(department.createdAt)}
              </span>
            </div>
            <div className="department-card__body">
              <p>
                <span>Description</span>
                {department.description || '—'}
              </p>
            </div>
            <div className="department-card__actions">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => onEdit(department)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn--outline-danger btn--sm"
                onClick={() => onDelete(department)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default DepartmentTable
