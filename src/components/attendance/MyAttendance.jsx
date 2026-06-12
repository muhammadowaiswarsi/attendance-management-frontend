import { useMemo, useState } from 'react'
import AttendanceTable from './AttendanceTable'
import { filterByMonth, paginate } from '../../utils/attendance'

const PAGE_SIZE = 10

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const MyAttendance = ({ records = [], loading }) => {
  const now = new Date()
  const [month, setMonth] = useState(String(now.getMonth() + 1))
  const [year, setYear] = useState(String(now.getFullYear()))
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () => filterByMonth(records, month, year),
    [records, month, year]
  )

  const paginated = useMemo(
    () => paginate(filtered, page, PAGE_SIZE),
    [filtered, page]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const years = useMemo(() => {
    const current = now.getFullYear()
    return [current - 1, current, current + 1]
  }, [now])

  return (
    <div className="my-attendance">
      <div className="my-attendance__filters">
        <div className="form-group">
          <label htmlFor="month-filter">Month</label>
          <select
            id="month-filter"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value)
              setPage(1)
            }}
          >
            {monthNames.map((name, index) => (
              <option key={name} value={String(index + 1)}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="year-filter">Year</label>
          <select
            id="year-filter"
            value={year}
            onChange={(e) => {
              setYear(e.target.value)
              setPage(1)
            }}
          >
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="employees-panel">
        <AttendanceTable
          records={paginated}
          loading={loading}
          showEmployeeInfo={false}
        />

        {!loading && filtered.length > PAGE_SIZE && (
          <div className="pagination">
            <button
              type="button"
              className="btn btn--outline btn--sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAttendance
