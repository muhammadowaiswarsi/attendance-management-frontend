const formatCategory = (category) =>
  category === 'deduction' ? 'Deduction' : 'Earning'

const formatType = (fieldType) => (fieldType === 'amount' ? 'Amount' : fieldType)

const PayslipFieldTable = ({
  fields = [],
  loading,
  onEdit,
  onToggle,
  onDelete,
  onMove,
  togglingId,
}) => {
  if (loading) {
    return (
      <div className="holiday-table-loading">
        <div className="spinner" />
        <p>Loading payslip fields...</p>
      </div>
    )
  }

  if (fields.length === 0) {
    return (
      <div className="holiday-empty">
        <span className="holiday-empty__icon">💰</span>
        <h3>No payslip fields</h3>
        <p>Add a field to start customizing payslip forms.</p>
      </div>
    )
  }

  return (
    <>
      <div className="holiday-table-wrap">
        <table className="holiday-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Field Name</th>
              <th>Key</th>
              <th>Type</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td data-label="Order">
                  <div className="payslip-field-order">
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      disabled={index === 0}
                      onClick={() => onMove(index, -1)}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      disabled={index === fields.length - 1}
                      onClick={() => onMove(index, 1)}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                  </div>
                </td>
                <td data-label="Name">
                  {field.name}
                  {field.isSystem && <span className="badge badge--muted">System</span>}
                </td>
                <td data-label="Key">{field.fieldKey}</td>
                <td data-label="Type">{formatType(field.fieldType)}</td>
                <td data-label="Category">{formatCategory(field.category)}</td>
                <td data-label="Status">
                  <span className={`badge ${field.isActive ? 'badge--success' : 'badge--muted'}`}>
                    {field.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td data-label="Actions">
                  <div className="holiday-actions">
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => onEdit(field)}
                    >
                      Edit
                    </button>
                    {field.fieldKey !== 'basic_salary' && (
                      <button
                        type="button"
                        className={`btn btn--sm ${
                          field.isActive ? 'btn--outline-danger' : 'btn--outline-success'
                        }`}
                        disabled={togglingId === field.id}
                        onClick={() => onToggle(field)}
                      >
                        {field.isActive ? 'Disable' : 'Enable'}
                      </button>
                    )}
                    {!field.isSystem && (
                      <button
                        type="button"
                        className="btn btn--outline-danger btn--sm"
                        onClick={() => onDelete(field)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="holiday-cards">
        {fields.map((field, index) => (
          <div key={field.id} className="holiday-card">
            <div className="holiday-card__content">
              <h4>
                {field.name}{' '}
                {field.isSystem && <span className="badge badge--muted">System</span>}
              </h4>
              <p>
                {field.fieldKey} · {formatType(field.fieldType)} · {formatCategory(field.category)}
              </p>
              <p>
                <span className={`badge ${field.isActive ? 'badge--success' : 'badge--muted'}`}>
                  {field.isActive ? 'Active' : 'Disabled'}
                </span>
              </p>
            </div>
            <div className="holiday-card__actions">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                disabled={index === 0}
                onClick={() => onMove(index, -1)}
              >
                Up
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                disabled={index === fields.length - 1}
                onClick={() => onMove(index, 1)}
              >
                Down
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => onEdit(field)}
              >
                Edit
              </button>
              {field.fieldKey !== 'basic_salary' && (
                <button
                  type="button"
                  className={`btn btn--sm ${
                    field.isActive ? 'btn--outline-danger' : 'btn--outline-success'
                  }`}
                  disabled={togglingId === field.id}
                  onClick={() => onToggle(field)}
                >
                  {field.isActive ? 'Disable' : 'Enable'}
                </button>
              )}
              {!field.isSystem && (
                <button
                  type="button"
                  className="btn btn--outline-danger btn--sm"
                  onClick={() => onDelete(field)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default PayslipFieldTable
