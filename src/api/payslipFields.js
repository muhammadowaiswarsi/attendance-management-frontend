import api from './axios'

export const fromApiResponse = (row) => ({
  id: row.id,
  name: row.name,
  fieldKey: row.field_key,
  fieldType: row.field_type,
  category: row.category,
  isActive: row.is_active,
  displayOrder: row.display_order,
  isSystem: row.is_system,
  createdAt: row.created_at,
})

export const getPayslipFields = async () => {
  const { data } = await api.get('/payslip-fields')
  return data.map(fromApiResponse)
}

export const getActivePayslipFields = async () => {
  const { data } = await api.get('/payslip-fields/active')
  return data.map(fromApiResponse)
}

export const createPayslipField = async (form) => {
  const { data } = await api.post('/payslip-fields', {
    name: form.name.trim(),
    field_type: form.fieldType || 'amount',
    category: form.category,
    is_active: form.isActive ?? true,
  })
  return fromApiResponse(data)
}

export const updatePayslipField = async (id, form) => {
  const payload = {}
  if (form.name != null) payload.name = form.name.trim()
  if (form.category != null) payload.category = form.category
  if (form.isActive != null) payload.is_active = form.isActive
  if (form.displayOrder != null) payload.display_order = form.displayOrder

  const { data } = await api.put(`/payslip-fields/${id}`, payload)
  return fromApiResponse(data)
}

export const reorderPayslipFields = async (fields) => {
  const { data } = await api.put('/payslip-fields/reorder', {
    fields: fields.map((field, index) => ({
      id: field.id,
      display_order: index + 1,
    })),
  })
  return data.map(fromApiResponse)
}

export const deletePayslipField = async (id) => {
  const { data } = await api.delete(`/payslip-fields/${id}`)
  return data
}
