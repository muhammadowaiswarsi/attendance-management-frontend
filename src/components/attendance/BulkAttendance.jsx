import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ATTENDANCE_STATUSES } from '../../api/attendance'
import ConfirmDialog from '../ui/ConfirmDialog'
import PageHeader from '../ui/PageHeader'
import { todayISO } from '../../utils/attendance'

const BulkAttendance = ({
  employees = [],
  defaultDate,
  onSubmit,
  submitting,
}) => {
  const [date, setDate] = useState(defaultDate || todayISO())
  const [search, setSearch] = useState('')
  const [rows, setRows] = useState({})
  const [confirmOpen, setConfirmOpen] = useState(false)

  const activeEmployees = useMemo(
    () => employees.filter((e) => e.isActive),
    [employees]
  )

  useEffect(() => {
    const initial = {}
    activeEmployees.forEach((employee) => {
      initial[employee.id] = { selected: false, status: 'Present', remarks: '' }
    })
    setRows(initial)
  }, [activeEmployees])

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return activeEmployees
    const q = search.toLowerCase()
    return activeEmployees.filter(
      (e) =>
        e.fullName.toLowerCase().includes(q) ||
        e.employeeCode.toLowerCase().includes(q)
    )
  }, [activeEmployees, search])

  const selectedCount = Object.values(rows).filter((r) => r.selected).length

  const toggleAll = (checked) => {
    setRows((prev) => {
      const next = { ...prev }
      filteredEmployees.forEach((employee) => {
        if (next[employee.id]) {
          next[employee.id] = { ...next[employee.id], selected: checked }
        }
      })
      return next
    })
  }

  const updateRow = (id, field, value) => {
    setRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
  }

  const handleSubmit = () => {
    const records = Object.entries(rows)
      .filter(([, row]) => row.selected)
      .map(([employeeId, row]) => ({
        employeeId: Number(employeeId),
        status: row.status,
        remarks: row.remarks,
      }))

    if (!records.length) return
    onSubmit({ attendanceDate: date, records })
    setConfirmOpen(false)
  }

  return (
    <div className="bulk-attendance">
      <PageHeader
        title="Bulk Mark Attendance"
        subtitle="Mark attendance for multiple employees at once"
        actions={
          <Link to="/admin/attendance" className="btn btn--outline">
            ← Back to Attendance
          </Link>
        }
      />

      <div className="employees-panel">
        <div className="bulk-attendance__toolbar">
          <div className="attendance-filters__date">
            <label htmlFor="bulk-date">Date</label>
            <input
              id="bulk-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="attendance-filters__search">
            <span className="attendance-filters__icon">🔍</span>
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn btn--primary"
            disabled={!selectedCount || submitting}
            onClick={() => setConfirmOpen(true)}
          >
            Submit Bulk ({selectedCount})
          </button>
        </div>

        <div className="employee-table-wrap">
          <table className="employee-table bulk-attendance-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      filteredEmployees.length > 0 &&
                      filteredEmployees.every((e) => rows[e.id]?.selected)
                    }
                    onChange={(e) => toggleAll(e.target.checked)}
                  />
                </th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="dashboard-table__empty">
                    No active employees found.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={rows[employee.id]?.selected || false}
                        onChange={(e) => updateRow(employee.id, 'selected', e.target.checked)}
                      />
                    </td>
                    <td>{employee.fullName}</td>
                    <td>{employee.departmentName}</td>
                    <td>
                      <select
                        className="bulk-attendance-table__select"
                        value={rows[employee.id]?.status || 'Present'}
                        onChange={(e) => updateRow(employee.id, 'status', e.target.value)}
                      >
                        {ATTENDANCE_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className="bulk-attendance-table__remarks"
                        value={rows[employee.id]?.remarks || ''}
                        onChange={(e) => updateRow(employee.id, 'remarks', e.target.value)}
                        placeholder="Optional"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Bulk Attendance"
        message={`Mark attendance for ${selectedCount} employee(s) on ${date}?`}
        confirmLabel="Submit"
        variant="primary"
        onConfirm={handleSubmit}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}

export default BulkAttendance
