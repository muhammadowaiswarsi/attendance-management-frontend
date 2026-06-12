import api from './axios'

export const fromApiResponse = (row) => ({
  id: row.id,
  name: row.title,
  date: row.holiday_date,
  description: row.description,
  createdAt: row.created_at,
})

export const getHolidays = async (year) => {
  const { data } = await api.get('/holidays', {
    params: year ? { year } : undefined,
  })
  return data.map(fromApiResponse)
}

export const createHoliday = async (form) => {
  const { data } = await api.post('/holidays', {
    title: form.name.trim(),
    holiday_date: form.date,
    description: form.description?.trim() || null,
  })
  return fromApiResponse(data)
}

export const updateHoliday = async (id, form) => {
  const { data } = await api.put(`/holidays/${id}`, {
    title: form.name.trim(),
    holiday_date: form.date,
    description: form.description?.trim() || null,
  })
  return fromApiResponse(data)
}

export const deleteHoliday = async (id) => {
  const { data } = await api.delete(`/holidays/${id}`)
  return data
}
