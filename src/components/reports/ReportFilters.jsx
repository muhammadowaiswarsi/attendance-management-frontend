import { MONTH_OPTIONS } from '../../utils/payslips'

const ReportFilters = ({
  showEmployee = false,
  showDepartment = false,
  employees = [],
  departments = [],
  employeeId = '',
  departmentId = '',
  month = '',
  year = '',
  years = [],
  onEmployeeChange,
  onDepartmentChange,
  onMonthChange,
  onYearChange,
  onSubmit,
  submitLabel = 'Generate Report',
  loading = false,
  disabled = false,
}) => {
  return (
    <form
      className="report-filters"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.()
      }}
    >
      {showEmployee && (
        <select
          className="attendance-filters__select report-filters__select"
          value={employeeId}
          onChange={(event) => onEmployeeChange(event.target.value)}
          required
        >
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.fullName} ({employee.employeeCode})
            </option>
          ))}
        </select>
      )}

      {showDepartment && (
        <select
          className="attendance-filters__select report-filters__select"
          value={departmentId}
          onChange={(event) => onDepartmentChange(event.target.value)}
          required
        >
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      )}

      <select
        className="attendance-filters__select report-filters__select"
        value={month}
        onChange={(event) => onMonthChange(event.target.value)}
        required
      >
        <option value="">Select Month</option>
        {MONTH_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        className="attendance-filters__select report-filters__select"
        value={year}
        onChange={(event) => onYearChange(event.target.value)}
        required
      >
        <option value="">Select Year</option>
        {years.map((optionYear) => (
          <option key={optionYear} value={optionYear}>
            {optionYear}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="btn btn--primary report-filters__submit"
        disabled={disabled || loading}
      >
        {loading ? 'Generating...' : submitLabel}
      </button>
    </form>
  )
}

export default ReportFilters
