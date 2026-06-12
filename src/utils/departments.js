export const formatDepartmentDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const filterDepartmentsByName = (departments, search) => {
  const query = search.trim().toLowerCase()
  if (!query) return departments
  return departments.filter((department) =>
    department.name.toLowerCase().includes(query)
  )
}
