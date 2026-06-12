const AttendanceFilters = ({
  date,
  department,
  status,
  search,
  departments = [],
  onDateChange,
  onDepartmentChange,
  onStatusChange,
  onSearchChange,
  showDate = true,
}) => {
  return (
    <div className="attendance-filters">
      {showDate && (
        <div className="attendance-filters__date">
          <label htmlFor="attendance-date">Date</label>
          <input
            id="attendance-date"
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      )}

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
        value={department}
        onChange={(e) => onDepartmentChange(e.target.value)}
      >
        <option value="">All Departments</option>
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>

      <select
        className="attendance-filters__select"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
        <option value="Half Day">Half Day</option>
        <option value="On Leave">On Leave</option>
        <option value="Holiday">Holiday</option>
      </select>
    </div>
  )
}

export default AttendanceFilters
