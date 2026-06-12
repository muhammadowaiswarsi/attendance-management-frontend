import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MONTH_OPTIONS,
  calcNetSalary,
  formatCurrency,
} from '../../utils/payslips'

const CreatePayslipForm = ({ employees = [], onSubmit, submitting }) => {
  const now = new Date()
  const [form, setForm] = useState({
    employeeId: '',
    month: String(now.getMonth() + 1),
    year: String(now.getFullYear()),
    basicSalary: '',
    allowances: '0',
    deductions: '0',
  })
  const [errors, setErrors] = useState({})

  const activeEmployees = useMemo(
    () => employees.filter((e) => e.isActive),
    [employees]
  )

  const netSalary = useMemo(
    () => calcNetSalary(form.basicSalary, form.allowances, form.deductions),
    [form.basicSalary, form.allowances, form.deductions]
  )

  useEffect(() => {
    if (!form.employeeId) return
    const employee = activeEmployees.find((e) => String(e.id) === form.employeeId)
    if (employee?.salary) {
      setForm((prev) => ({
        ...prev,
        basicSalary: String(employee.salary),
      }))
    }
  }, [form.employeeId, activeEmployees])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.employeeId) nextErrors.employeeId = 'Employee is required'
    if (!form.month) nextErrors.month = 'Month is required'
    if (!form.year) nextErrors.year = 'Year is required'
    if (!form.basicSalary || Number(form.basicSalary) <= 0) {
      nextErrors.basicSalary = 'Basic salary must be greater than 0'
    }
    if (Number(form.allowances) < 0) nextErrors.allowances = 'Allowances cannot be negative'
    if (Number(form.deductions) < 0) nextErrors.deductions = 'Deductions cannot be negative'
    if (netSalary <= 0) nextErrors.deductions = 'Net salary must be greater than 0'

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    onSubmit(form)
  }

  const years = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1]

  return (
    <div className="create-payslip">
      <form className="create-payslip__form" onSubmit={handleSubmit}>
        <div className="form-row">
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

          <div className="form-group">
            <label htmlFor="month">Month *</label>
            <select
              id="month"
              name="month"
              value={form.month}
              onChange={handleChange}
              className={errors.month ? 'input--error' : ''}
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="year">Year *</label>
            <select
              id="year"
              name="year"
              value={form.year}
              onChange={handleChange}
              className={errors.year ? 'input--error' : ''}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="basicSalary">Basic Salary *</label>
            <input
              id="basicSalary"
              name="basicSalary"
              type="number"
              min="1"
              step="1"
              value={form.basicSalary}
              onChange={handleChange}
              className={errors.basicSalary ? 'input--error' : ''}
              placeholder="50000"
            />
            {errors.basicSalary && <span className="field-error">{errors.basicSalary}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="allowances">Allowances</label>
            <input
              id="allowances"
              name="allowances"
              type="number"
              min="0"
              step="1"
              value={form.allowances}
              onChange={handleChange}
              className={errors.allowances ? 'input--error' : ''}
            />
            {errors.allowances && <span className="field-error">{errors.allowances}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="deductions">Deductions</label>
            <input
              id="deductions"
              name="deductions"
              type="number"
              min="0"
              step="1"
              value={form.deductions}
              onChange={handleChange}
              className={errors.deductions ? 'input--error' : ''}
            />
            {errors.deductions && <span className="field-error">{errors.deductions}</span>}
          </div>
        </div>

        <div className="payslip-calc">
          <div className="payslip-calc__row">
            <span>Basic Salary</span>
            <strong>{formatCurrency(form.basicSalary || 0)}</strong>
          </div>
          <div className="payslip-calc__row">
            <span>+ Allowances</span>
            <strong>{formatCurrency(form.allowances || 0)}</strong>
          </div>
          <div className="payslip-calc__row">
            <span>− Deductions</span>
            <strong>{formatCurrency(form.deductions || 0)}</strong>
          </div>
          <div className="payslip-calc__row payslip-calc__row--total">
            <span>Net Salary</span>
            <strong>{formatCurrency(netSalary)}</strong>
          </div>
        </div>

        <div className="create-payslip__actions">
          <Link to="/admin/payslips" className="btn btn--outline">
            Cancel
          </Link>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Payslip'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePayslipForm
