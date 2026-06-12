import api from './axios'

export const fromProfileResponse = (row) => ({
  fullName: row.full_name,
  email: row.email,
  role: row.role,
  isActive: row.is_active,
  employeeCode: row.employee_code,
  departmentName: row.department_name,
  designation: row.designation,
  joiningDate: row.joining_date,
  phoneNumber: row.phone_number,
  address: row.address,
  lastLogin: row.last_login,
})

export const getProfile = async () => {
  const { data } = await api.get('/auth/profile')
  return fromProfileResponse(data)
}

export const updateProfile = async (form) => {
  const { data } = await api.put('/auth/profile', {
    phone_number: form.phoneNumber?.trim() || null,
    address: form.address?.trim() || null,
  })
  return fromProfileResponse(data)
}

export const changePassword = async (form) => {
  const { data } = await api.post('/auth/change-password', {
    current_password: form.currentPassword,
    new_password: form.newPassword,
  })
  return data
}

export const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email })
  return data
}

export const resetPassword = async (token, password) => {
  const { data } = await api.post('/auth/reset-password', {
    token,
    password,
  })
  return data
}
