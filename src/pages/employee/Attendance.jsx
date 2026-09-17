import { getMyAttendance } from '../../api/attendance'
import MyAttendance from '../../components/attendance/MyAttendance'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'
import useCachedResource from '../../hooks/useCachedResource'
import { CACHE_KEYS } from '../../utils/pageCache'

const EmployeeAttendance = () => {
  const { showToast } = useToast()
  const { data: records = [], loading } = useCachedResource(
    CACHE_KEYS.myAttendance,
    async () => {
      try {
        return await getMyAttendance()
      } catch (err) {
        const message = err.response?.data?.detail || 'Failed to load attendance'
        showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
        throw err
      }
    }
  )

  return (
    <div>
      <PageHeader title="My Attendance" subtitle="Your attendance records" />
      <MyAttendance records={records} loading={loading} />
    </div>
  )
}

export default EmployeeAttendance
