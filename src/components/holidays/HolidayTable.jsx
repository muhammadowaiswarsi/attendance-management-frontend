import { formatHolidayDate } from '../../utils/holidays'

const HolidayTable = ({
  holidays = [],
  loading,
  readOnly = false,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="holiday-table-loading">
        <div className="spinner" />
        <p>Loading holidays...</p>
      </div>
    )
  }

  if (holidays.length === 0) {
    return (
      <div className="holiday-empty">
        <span className="holiday-empty__icon">🎉</span>
        <h3>No holidays found</h3>
        <p>
          {readOnly
            ? 'No holidays scheduled for this year yet.'
            : 'Add a holiday or try selecting a different year.'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="holiday-table-wrap">
        <table className="holiday-table">
          <thead>
            <tr>
              <th>Holiday Name</th>
              <th>Date</th>
              <th>Description</th>
              {!readOnly && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {holidays.map((holiday) => (
              <tr key={holiday.id}>
                <td data-label="Name">{holiday.name}</td>
                <td data-label="Date">{formatHolidayDate(holiday.date)}</td>
                <td data-label="Description">{holiday.description || '—'}</td>
                {!readOnly && (
                  <td data-label="Actions">
                    <div className="holiday-actions">
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        onClick={() => onEdit(holiday)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn--outline-danger btn--sm"
                        onClick={() => onDelete(holiday)}
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

      <div className="holiday-cards">
        {holidays.map((holiday) => (
          <div key={holiday.id} className="holiday-card">
            <div className="holiday-card__date">
              <span>{new Date(`${holiday.date}T00:00:00`).getDate()}</span>
              <small>
                {new Date(`${holiday.date}T00:00:00`).toLocaleDateString('en-US', {
                  month: 'short',
                })}
              </small>
            </div>
            <div className="holiday-card__content">
              <h4>{holiday.name}</h4>
              <p>{formatHolidayDate(holiday.date)}</p>
              <p className="holiday-card__description">{holiday.description || '—'}</p>
            </div>
            {!readOnly && (
              <div className="holiday-card__actions">
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => onEdit(holiday)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn--outline-danger btn--sm"
                  onClick={() => onDelete(holiday)}
                >
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

export default HolidayTable
