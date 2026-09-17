import { useState } from 'react'
import { bulkMarkAttendance } from '../../api/attendance'
import { getEmployees } from '../../api/employees'
import BulkAttendance from '../../components/attendance/BulkAttendance'
import { useToast } from '../../context/ToastContext'
import useCachedResource from '../../hooks/useCachedResource'
import { todayISO } from '../../utils/attendance'
import { CACHE_KEYS, invalidateAfterAttendanceChange } from '../../utils/pageCache'

const AdminBulkAttendance = () => {
  const { showToast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const { data: employees = [] } = useCachedResource(
    CACHE_KEYS.employees,
    async () => {
      try {
        return await getEmployees()
      } catch {
        showToast('Failed to load employees', 'error')
        throw new Error('Failed to load employees')
      }
    }
  )

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      await bulkMarkAttendance(payload)
      invalidateAfterAttendanceChange()
      showToast(`Attendance marked for ${payload.records.length} employees`)
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to bulk mark attendance'
      showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <BulkAttendance
      employees={employees}
      defaultDate={todayISO()}
      onSubmit={handleSubmit}
      submitting={submitting}
    />
  )
}

export default AdminBulkAttendance
