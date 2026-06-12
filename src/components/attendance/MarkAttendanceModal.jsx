import { useEffect, useState } from 'react'
import { ATTENDANCE_STATUSES } from '../../api/attendance'

const MarkAttendanceModal = ({
  open,
  mode = 'mark',
  record,
  employees = [],
  defaultDate,
  onClose,
  onSubmit,
  submitting,
}) => {
  const [form, setForm] = useState({
    employeeId: '',
    attendanceDate: defaultDate,
    status: 'Present',
    remarks: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return

    if (mode === 'edit' && record) {
      setForm({
        employeeId: String(record.employeeId),
        attendanceDate: record.attendanceDate,
        status: record.status,
        remarks: record.remarks || '',
      })
    } else {
      setForm({
        employeeId: '',
        attendanceDate: defaultDate,
        status: 'Present',
        remarks: '',
      })
    }
    setErrors({})
  }, [open, mode, record, defaultDate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (mode === 'mark' && !form.employeeId) {
      nextErrors.employeeId = 'Employee is required'
    }
    if (!form.status) nextErrors.status = 'Status is required'
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    onSubmit(form)
  }

  if (!open) return null

  const activeEmployees = employees.filter((e) => e.isActive)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{mode === 'edit' ? 'Edit Attendance' : 'Mark Attendance'}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          {mode === 'mark' && (
            <div className="form-group">
              <label htmlFor="employeeId">Employee *</label>
              <select
                id="employeeId"
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                className={errors.employeeId ? 'input--error' : ''}
              >
                <option value="">Select employee</option>
                {activeEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName} ({employee.employeeCode})
                  </option>
                ))}
              </select>
              {errors.employeeId && <span className="field-error">{errors.employeeId}</span>}
            </div>
          )}

          {mode === 'edit' && (
            <div className="form-group">
              <label>Employee</label>
              <input value={record?.employeeName || ''} disabled />
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="attendanceDate">Date</label>
              <input
                id="attendanceDate"
                name="attendanceDate"
                type="date"
                value={form.attendanceDate}
                onChange={handleChange}
                disabled={mode === 'edit'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className={errors.status ? 'input--error' : ''}
              >
                {ATTENDANCE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && <span className="field-error">{errors.status}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="remarks">Remarks</label>
            <textarea
              id="remarks"
              name="remarks"
              rows={3}
              value={form.remarks}
              onChange={handleChange}
              placeholder="Optional notes"
            />
          </div>

          <div className="modal__footer">
            <button type="button" className="btn btn--outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Saving...' : mode === 'edit' ? 'Update' : 'Mark Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MarkAttendanceModal
