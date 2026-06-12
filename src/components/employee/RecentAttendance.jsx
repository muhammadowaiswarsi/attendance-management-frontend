const statusClass = {
  Present: 'badge badge--success',
  Absent: 'badge badge--danger',
  'Half Day': 'badge badge--warning',
  Leave: 'badge badge--info',
  'On Leave': 'badge badge--info',
  Holiday: 'badge badge--muted',
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const RecentAttendance = ({ records = [] }) => {
  return (
    <div className="dashboard-table-wrap">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={2} className="dashboard-table__empty">
                No attendance records found.
              </td>
            </tr>
          ) : (
            records.map((row) => (
              <tr key={row.id}>
                <td>{formatDate(row.date)}</td>
                <td>
                  <span className={statusClass[row.status] || 'badge badge--muted'}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default RecentAttendance
