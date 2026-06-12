import { useEffect, useState } from 'react'
import { bulkMarkAttendance } from '../../api/attendance'
import { getEmployees } from '../../api/employees'
import BulkAttendance from '../../components/attendance/BulkAttendance'
import { useToast } from '../../context/ToastContext'
import { todayISO } from '../../utils/attendance'

const AdminBulkAttendance = () => {
  const { showToast } = useToast()
  const [employees, setEmployees] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch(() => showToast('Failed to load employees', 'error'))
  }, [showToast])

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      await bulkMarkAttendance(payload)
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
