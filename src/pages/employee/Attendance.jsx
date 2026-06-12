import { useEffect, useState } from 'react'
import { getMyAttendance } from '../../api/attendance'
import MyAttendance from '../../components/attendance/MyAttendance'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'

const EmployeeAttendance = () => {
  const { showToast } = useToast()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyAttendance()
        setRecords(data)
      } catch (err) {
        const message = err.response?.data?.detail || 'Failed to load attendance'
        showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [showToast])

  return (
    <div>
      <PageHeader title="My Attendance" subtitle="Your attendance records" />
      <MyAttendance records={records} loading={loading} />
    </div>
  )
}

export default EmployeeAttendance
