import { STATUS_BADGE_CLASS, formatDisplayDate } from '../../utils/attendance'

const AttendanceTable = ({
  records = [],
  loading,
  showEmployeeInfo = true,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="employee-table-loading">
        <div className="spinner" />
        <p>Loading attendance...</p>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="employee-empty">
        <span className="employee-empty__icon">📅</span>
        <h3>No attendance records</h3>
        <p>No records match your filters for this date.</p>
      </div>
    )
  }

  return (
    <>
      <div className="employee-table-wrap">
        <table className="employee-table attendance-table">
          <thead>
            <tr>
              {showEmployeeInfo && (
                <>
                  <th>Employee Name</th>
                  <th>Employee Code</th>
                  <th>Department</th>
                </>
              )}
              <th>Date</th>
              <th>Status</th>
              <th>Remarks</th>
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                {showEmployeeInfo && (
                  <>
                    <td data-label="Employee">{record.employeeName}</td>
                    <td data-label="Code">{record.employeeCode || '—'}</td>
                    <td data-label="Department">{record.departmentName || '—'}</td>
                  </>
                )}
                <td data-label="Date">{formatDisplayDate(record.attendanceDate)}</td>
                <td data-label="Status">
                  <span className={STATUS_BADGE_CLASS[record.status] || 'badge badge--muted'}>
                    {record.status}
                  </span>
                </td>
                <td data-label="Remarks">{record.remarks || '—'}</td>
                {showActions && (
                  <td data-label="Actions">
                    <div className="employee-actions">
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        onClick={() => onEdit?.(record)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn--outline-danger btn--sm"
                        onClick={() => onDelete?.(record)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="attendance-cards">
        {records.map((record) => (
          <div key={record.id} className="attendance-card">
            <div className="attendance-card__header">
              {showEmployeeInfo ? (
                <div>
                  <h4>{record.employeeName}</h4>
                  <p>{record.employeeCode || '—'}</p>
                </div>
              ) : (
                <h4>{formatDisplayDate(record.attendanceDate)}</h4>
              )}
              <span className={STATUS_BADGE_CLASS[record.status] || 'badge badge--muted'}>
                {record.status}
              </span>
            </div>
            <div className="attendance-card__body">
              {showEmployeeInfo && (
                <p><span>Department</span>{record.departmentName || '—'}</p>
              )}
              {showEmployeeInfo && (
                <p><span>Date</span>{formatDisplayDate(record.attendanceDate)}</p>
              )}
              <p><span>Remarks</span>{record.remarks || '—'}</p>
            </div>
            {showActions && (
              <div className="employee-card__actions">
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => onEdit?.(record)}>
                  Edit
                </button>
                <button type="button" className="btn btn--outline-danger btn--sm" onClick={() => onDelete?.(record)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default AttendanceTable
