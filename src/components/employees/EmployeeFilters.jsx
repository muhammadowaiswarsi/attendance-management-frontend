const EmployeeFilters = ({
  search,
  department,
  status,
  departments = [],
  onSearchChange,
  onDepartmentChange,
  onStatusChange,
}) => {
  return (
    <div className="employee-filters">
      <div className="employee-filters__search">
        <span className="employee-filters__icon">🔍</span>
        <input
          type="text"
          placeholder="Search by name, email, or code..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        className="employee-filters__select"
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
        className="employee-filters__select"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  )
}

export default EmployeeFilters
