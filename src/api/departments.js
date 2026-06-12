import api from './axios'

export const fromApiResponse = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  createdAt: row.created_at,
})

export const enrichWithEmployeeCounts = (departments, employees = []) => {
  const counts = employees.reduce((acc, employee) => {
    const key = employee.departmentId
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return departments.map((department) => ({
    ...department,
    totalEmployees: counts[department.id] || 0,
  }))
}

export const getDepartments = async () => {
  const { data } = await api.get('/departments')
  return data.map(fromApiResponse)
}

export const createDepartment = async (form) => {
  const { data } = await api.post('/departments', {
    name: form.name.trim(),
    description: form.description?.trim() || null,
  })
  return fromApiResponse(data)
}

export const updateDepartment = async (id, form) => {
  const { data } = await api.put(`/departments/${id}`, {
    name: form.name.trim(),
    description: form.description?.trim() || null,
  })
  return fromApiResponse(data)
}

export const deleteDepartment = async (id) => {
  const { data } = await api.delete(`/departments/${id}`)
  return data
}
