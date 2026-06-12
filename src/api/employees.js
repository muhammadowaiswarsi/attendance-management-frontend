import api from './axios'

const toApiPayload = (data) => ({
  full_name: data.fullName,
  email: data.email,
  phone_number: data.phoneNumber || null,
  designation: data.designation || null,
  joining_date: data.joiningDate,
  address: data.address || null,
  department_id: Number(data.departmentId),
  salary: Number(data.salary),
})

const toUpdatePayload = (data) => ({
  full_name: data.fullName,
  phone_number: data.phoneNumber || null,
  designation: data.designation || null,
  address: data.address || null,
  department_id: Number(data.departmentId),
  salary: Number(data.salary),
})

export const fromApiResponse = (row) => ({
  id: row.id,
  employeeCode: row.employee_code,
  fullName: row.full_name,
  email: row.email,
  phoneNumber: row.phone_number,
  designation: row.designation,
  departmentId: row.department_id,
  departmentName: row.department_name,
  joiningDate: row.joining_date,
  address: row.address,
  isActive: row.is_active,
  passwordSet: row.password_set,
  salary: Number(row.salary),
})

export const getEmployees = async (search) => {
  const { data } = await api.get('/employees', {
    params: search?.trim() ? { search: search.trim() } : undefined,
  })
  return data.map(fromApiResponse)
}

export const getEmployeeById = async (id) => {
  const { data } = await api.get(`/employees/${id}`)
  return fromApiResponse(data)
}

export const createEmployee = async (formData) => {
  const { data } = await api.post('/employees', toApiPayload(formData))
  return fromApiResponse(data)
}

export const updateEmployee = async (id, formData) => {
  const { data } = await api.put(`/employees/${id}`, toUpdatePayload(formData))
  return fromApiResponse(data)
}

export const toggleEmployeeStatus = async (id, activate) => {
  const endpoint = activate ? 'activate' : 'deactivate'
  const { data } = await api.patch(`/employees/${id}/${endpoint}`)
  return fromApiResponse(data)
}

export const resendEmployeeInvitation = async (id) => {
  const { data } = await api.post(`/employees/${id}/resend-invitation`)
  return data
}

export const deleteEmployee = async (id) => {
  const { data } = await api.delete(`/employees/${id}`)
  return data
}
