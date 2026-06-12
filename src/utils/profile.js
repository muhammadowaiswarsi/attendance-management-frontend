export const formatProfileDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatRoleLabel = (role) => {
  if (!role) return '—'
  return role.charAt(0).toUpperCase() + role.slice(1)
}
