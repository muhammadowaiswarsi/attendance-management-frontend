const statusClass = {
  Present: 'badge badge--success',
  Absent: 'badge badge--danger',
  'Half Day': 'badge badge--warning',
  'On Leave': 'badge badge--info',
  Holiday: 'badge badge--muted',
}

const AttendanceTable = ({ records = [] }) => {
  return (
    <div className="dashboard-table-wrap">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Department</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={3} className="dashboard-table__empty">
                No attendance records for today.
              </td>
            </tr>
          ) : (
            records.map((row) => (
              <tr key={row.id}>
                <td>{row.employeeName}</td>
                <td>{row.department}</td>
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

export default AttendanceTable
