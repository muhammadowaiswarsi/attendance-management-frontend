import api from './axios'

export const ATTENDANCE_STATUSES = ['Present', 'Absent', 'Half Day', 'On Leave', 'Holiday']

export const fromApiResponse = (row) => ({
  id: row.id,
  employeeId: row.employee_id,
  employeeName: row.employee_name,
  attendanceDate: row.attendance_date,
  status: row.status,
  remarks: row.remarks,
  markedBy: row.marked_by,
  createdAt: row.created_at,
})

export const enrichWithEmployees = (records, employees = []) => {
  const map = Object.fromEntries(employees.map((e) => [e.id, e]))
  return records.map((record) => ({
    ...record,
    employeeCode: map[record.employeeId]?.employeeCode || '—',
    departmentName: map[record.employeeId]?.departmentName || '—',
    departmentId: map[record.employeeId]?.departmentId,
  }))
}

export const getAttendance = async (date) => {
  const { data } = await api.get(`/attendance/date/${date}`)
  return data.map(fromApiResponse)
}

export const markAttendance = async (payload) => {
  const { data } = await api.post('/attendance', {
    employee_id: payload.employeeId,
    attendance_date: payload.attendanceDate,
    status: payload.status,
    remarks: payload.remarks || null,
  })
  return fromApiResponse(data)
}

export const bulkMarkAttendance = async (payload) => {
  const { data } = await api.post('/attendance/bulk', {
    attendance_date: payload.attendanceDate,
    records: payload.records.map((record) => ({
      employee_id: record.employeeId,
      status: record.status,
      remarks: record.remarks || null,
    })),
  })
  return data.map(fromApiResponse)
}

export const getMyAttendance = async () => {
  const { data } = await api.get('/attendance/my-attendance')
  return data.map(fromApiResponse)
}

export const getTodayAttendance = async () => {
  const { data } = await api.get('/attendance/today')
  return data.map((row) => ({
    id: row.id,
    employeeName: row.employee_name,
    department: row.department,
    status: row.status,
  }))
}

export const updateAttendance = async (id, payload) => {
  const { data } = await api.put(`/attendance/${id}`, {
    status: payload.status,
    remarks: payload.remarks ?? null,
  })
  return fromApiResponse(data)
}

export const deleteAttendance = async (id) => {
  await api.delete(`/attendance/${id}`)
}
