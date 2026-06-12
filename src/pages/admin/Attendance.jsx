import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  deleteAttendance,
  enrichWithEmployees,
  getAttendance,
  markAttendance,
  updateAttendance,
} from '../../api/attendance'
import { getDepartments } from '../../api/departments'
import { getEmployees } from '../../api/employees'
import AttendanceFilters from '../../components/attendance/AttendanceFilters'
import AttendanceTable from '../../components/attendance/AttendanceTable'
import MarkAttendanceModal from '../../components/attendance/MarkAttendanceModal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'
import { paginate, todayISO } from '../../utils/attendance'

const PAGE_SIZE = 10

const AdminAttendance = () => {
  const { showToast } = useToast()
  const [date, setDate] = useState(todayISO())
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const [records, setRecords] = useState([])
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [markOpen, setMarkOpen] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [attendanceData, employeeData, deptData] = await Promise.all([
        getAttendance(date),
        getEmployees(),
        getDepartments(),
      ])
      setEmployees(employeeData)
      setDepartments(deptData)
      setRecords(enrichWithEmployees(attendanceData, employeeData))
    } catch {
      showToast('Failed to load attendance', 'error')
    } finally {
      setLoading(false)
    }
  }, [date, showToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    setPage(1)
  }, [date, search, departmentFilter, statusFilter])

  const filtered = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        !search.trim() ||
        record.employeeName?.toLowerCase().includes(search.toLowerCase())
      const matchesDept =
        !departmentFilter || String(record.departmentId) === departmentFilter
      const matchesStatus = !statusFilter || record.status === statusFilter
      return matchesSearch && matchesDept && matchesStatus
    })
  }, [records, search, departmentFilter, statusFilter])

  const paginated = useMemo(
    () => paginate(filtered, page, PAGE_SIZE),
    [filtered, page]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const handleMarkSubmit = async (form) => {
    setSubmitting(true)
    try {
      if (editRecord) {
        await updateAttendance(editRecord.id, {
          status: form.status,
          remarks: form.remarks,
        })
        showToast('Attendance updated successfully')
      } else {
        await markAttendance({
          employeeId: Number(form.employeeId),
          attendanceDate: form.attendanceDate,
          status: form.status,
          remarks: form.remarks,
        })
        showToast('Attendance marked successfully')
      }
      setMarkOpen(false)
      setEditRecord(null)
      await loadData()
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to save attendance'
      showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    try {
      await deleteAttendance(deleteConfirm.id)
      showToast('Attendance record deleted')
      setDeleteConfirm(null)
      await loadData()
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to delete record'
      showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
    }
  }

  return (
    <div className="attendance-page">
      <PageHeader
        title="Attendance"
        subtitle="Mark and manage employee attendance"
        actions={
          <div className="attendance-page__actions">
            <button type="button" className="btn btn--primary" onClick={() => {
              setEditRecord(null)
              setMarkOpen(true)
            }}>
              Mark Attendance
            </button>
            <Link to="/admin/attendance/mark" className="btn btn--outline">
              Bulk Mark Attendance
            </Link>
          </div>
        }
      />

      <div className="employees-panel">
        <AttendanceFilters
          date={date}
          department={departmentFilter}
          status={statusFilter}
          search={search}
          departments={departments}
          onDateChange={setDate}
          onDepartmentChange={setDepartmentFilter}
          onStatusChange={setStatusFilter}
          onSearchChange={setSearch}
        />

        <AttendanceTable
          records={paginated}
          loading={loading}
          showActions
          onEdit={(record) => {
            setEditRecord(record)
            setMarkOpen(true)
          }}
          onDelete={setDeleteConfirm}
        />

        {!loading && filtered.length > PAGE_SIZE && (
          <div className="pagination">
            <button
              type="button"
              className="btn btn--outline btn--sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages} ({filtered.length} records)
            </span>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <MarkAttendanceModal
        open={markOpen}
        mode={editRecord ? 'edit' : 'mark'}
        record={editRecord}
        employees={employees}
        defaultDate={date}
        onClose={() => {
          setMarkOpen(false)
          setEditRecord(null)
        }}
        onSubmit={handleMarkSubmit}
        submitting={submitting}
      />

      <ConfirmDialog
        open={!!deleteConfirm}
        title="Delete Attendance"
        message={`Delete attendance record for ${deleteConfirm?.employeeName}?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}

export default AdminAttendance
