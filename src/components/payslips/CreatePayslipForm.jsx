import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MONTH_OPTIONS,
  calcNetSalaryFromFields,
  formatCurrency,
} from '../../utils/payslips'

const defaultValueForField = (field) => (field.fieldKey === 'basic_salary' ? '' : '0')

const CreatePayslipForm = ({ employees = [], fields = [], onSubmit, submitting }) => {
  const now = new Date()
  const [form, setForm] = useState({
    employeeId: '',
    month: String(now.getMonth() + 1),
    year: String(now.getFullYear()),
  })
  const [fieldValues, setFieldValues] = useState({})
  const [errors, setErrors] = useState({})

  const activeEmployees = useMemo(
    () => employees.filter((e) => e.isActive),
    [employees]
  )

  useEffect(() => {
    setFieldValues((prev) => {
      const next = {}
      fields.forEach((field) => {
        next[field.fieldKey] =
          prev[field.fieldKey] ?? defaultValueForField(field)
      })
      return next
    })
  }, [fields])

  const netSalary = useMemo(
    () => calcNetSalaryFromFields(fields, fieldValues),
    [fields, fieldValues]
  )

  useEffect(() => {
    if (!form.employeeId) return
    const employee = activeEmployees.find((e) => String(e.id) === form.employeeId)
    if (employee?.salary != null && fields.some((field) => field.fieldKey === 'basic_salary')) {
      setFieldValues((prev) => ({
        ...prev,
        basic_salary: String(employee.salary),
      }))
    }
  }, [form.employeeId, activeEmployees, fields])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleFieldChange = (fieldKey, value) => {
    setFieldValues((prev) => ({ ...prev, [fieldKey]: value }))
    if (errors[fieldKey]) setErrors((prev) => ({ ...prev, [fieldKey]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.employeeId) nextErrors.employeeId = 'Employee is required'
    if (!form.month) nextErrors.month = 'Month is required'
    if (!form.year) nextErrors.year = 'Year is required'

    fields.forEach((field) => {
      const raw = fieldValues[field.fieldKey]
      const amount = Number(raw)
      if (raw === '' || Number.isNaN(amount)) {
        nextErrors[field.fieldKey] = `${field.name} is required`
        return
      }
      if (field.fieldKey === 'basic_salary' && amount <= 0) {
        nextErrors[field.fieldKey] = 'Basic salary must be greater than 0'
        return
      }
      if (amount < 0) {
        nextErrors[field.fieldKey] = `${field.name} cannot be negative`
      }
    })

    if (netSalary <= 0) {
      nextErrors.netSalary = 'Net salary must be greater than 0'
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      ...form,
      fieldValues: fields.map((field) => ({
        fieldKey: field.fieldKey,
        value: Number(fieldValues[field.fieldKey] || 0),
      })),
    })
  }

  const years = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1]
  const amountFields = fields.filter((field) => field.fieldType === 'amount')

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
        </div>

        {amountFields.length > 0 && (
          <div className="create-payslip__fields">
            {Array.from({ length: Math.ceil(amountFields.length / 2) }, (_, rowIndex) => {
              const rowFields = amountFields.slice(rowIndex * 2, rowIndex * 2 + 2)
              return (
                <div className="form-row" key={rowFields.map((field) => field.id).join('-')}>
                  {rowFields.map((field) => (
                    <div className="form-group" key={field.id}>
                      <label htmlFor={`field-${field.fieldKey}`}>
                        {field.name}
                        {field.fieldKey === 'basic_salary' ? ' *' : ''}
                      </label>
                      <input
                        id={`field-${field.fieldKey}`}
                        name={field.fieldKey}
                        type="number"
                        min={field.fieldKey === 'basic_salary' ? '1' : '0'}
                        step="1"
                        value={fieldValues[field.fieldKey] ?? ''}
                        onChange={(event) => handleFieldChange(field.fieldKey, event.target.value)}
                        className={errors[field.fieldKey] ? 'input--error' : ''}
                        placeholder="0"
                      />
                      {errors[field.fieldKey] && (
                        <span className="field-error">{errors[field.fieldKey]}</span>
                      )}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )}

        <div className="payslip-calc">
          {fields.map((field) => (
            <div className="payslip-calc__row" key={field.id}>
              <span>
                {field.category === 'deduction' ? '− ' : field.fieldKey === 'basic_salary' ? '' : '+ '}
                {field.name}
              </span>
              <strong>{formatCurrency(fieldValues[field.fieldKey] || 0)}</strong>
            </div>
          ))}
          <div className="payslip-calc__row payslip-calc__row--total">
            <span>Net Salary</span>
            <strong>{formatCurrency(netSalary)}</strong>
          </div>
          {errors.netSalary && <span className="field-error">{errors.netSalary}</span>}
        </div>

        <div className="create-payslip__actions">
          <Link to="/admin/payslips" className="btn btn--outline">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={submitting || fields.length === 0}
          >
            {submitting ? 'Creating...' : 'Create Payslip'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePayslipForm
