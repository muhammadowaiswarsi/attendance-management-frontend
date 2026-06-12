import { MONTH_OPTIONS } from '../../utils/payslips'

const PayslipFilters = ({
  month,
  year,
  search,
  years = [],
  onMonthChange,
  onYearChange,
  onSearchChange,
}) => {
  return (
    <div className="payslip-filters">
      <div className="attendance-filters__search">
        <span className="attendance-filters__icon">🔍</span>
        <input
          type="text"
          placeholder="Search employee name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        className="attendance-filters__select"
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
      >
        <option value="">All Months</option>
        {MONTH_OPTIONS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>

      <select
        className="attendance-filters__select"
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
      >
        <option value="">All Years</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}

export default PayslipFilters
