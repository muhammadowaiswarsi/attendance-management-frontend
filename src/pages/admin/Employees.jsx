import { useCallback, useEffect, useMemo, useState } from 'react'
import { getDepartments } from '../../api/departments'
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  resendEmployeeInvitation,
  toggleEmployeeStatus,
  updateEmployee,
} from '../../api/employees'
import EmployeeDetails from '../../components/employees/EmployeeDetails'
import EmployeeFilters from '../../components/employees/EmployeeFilters'
import EmployeeFormModal from '../../components/employees/EmployeeFormModal'
import EmployeeTable from '../../components/employees/EmployeeTable'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'

const Employees = () => {
  const { showToast } = useToast()
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingToggle, setPendingToggle] = useState(null)

  const [resendConfirmOpen, setResendConfirmOpen] = useState(false)
  const [pendingResend, setPendingResend] = useState(null)
  const [resendLoadingId, setResendLoadingId] = useState(null)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleteLoadingId, setDeleteLoadingId] = useState(null)

  const loadEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getEmployees(search)
      setEmployees(data)
    } catch {
      showToast('Failed to load employees', 'error')
    } finally {
      setLoading(false)
    }
  }, [search, showToast])

  useEffect(() => {
    getDepartments().then(setDepartments).catch(() => {
      showToast('Failed to load departments', 'error')
    })
  }, [showToast])

  useEffect(() => {
    const timer = setTimeout(loadEmployees, 300)
    return () => clearTimeout(timer)
  }, [loadEmployees])

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesDept =
        !departmentFilter || String(employee.departmentId) === departmentFilter
      const matchesStatus =
        !statusFilter ||
        (statusFilter === 'active' && employee.isActive) ||
        (statusFilter === 'inactive' && !employee.isActive)
      return matchesDept && matchesStatus
    })
  }, [employees, departmentFilter, statusFilter])

  const openAddModal = () => {
    setModalMode('add')
    setSelectedEmployee(null)
    setModalOpen(true)
  }

  const openEditModal = (employee) => {
    setModalMode('edit')
    setSelectedEmployee(employee)
    setModalOpen(true)
  }

  const openDetails = (employee) => {
    setSelectedEmployee(employee)
    setDetailsOpen(true)
  }

  const handleFormSubmit = async (formData) => {
    setSubmitting(true)
    try {
      if (modalMode === 'add') {
        await createEmployee(formData)
        showToast('Employee added successfully')
      } else {
        await updateEmployee(selectedEmployee.id, formData)
        showToast('Employee updated successfully')
      }
      setModalOpen(false)
      await loadEmployees()
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        (modalMode === 'add' ? 'Failed to add employee' : 'Failed to update employee')
      showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleRequest = (employee) => {
    if (employee.isActive) {
      setPendingToggle(employee)
      setConfirmOpen(true)
    } else {
      handleToggleConfirm(employee)
    }
  }

  const handleToggleConfirm = async (employee = pendingToggle) => {
    if (!employee) return
    setConfirmOpen(false)
    try {
      await toggleEmployeeStatus(employee.id, !employee.isActive)
      showToast(
        employee.isActive
          ? `${employee.fullName} deactivated`
          : `${employee.fullName} activated`
      )
      await loadEmployees()
    } catch {
      showToast('Failed to update employee status', 'error')
    } finally {
      setPendingToggle(null)
    }
  }

  const handleResendRequest = (employee) => {
    setPendingResend(employee)
    setResendConfirmOpen(true)
  }

  const handleResendConfirm = async () => {
    if (!pendingResend) return

    setResendLoadingId(pendingResend.id)
    setResendConfirmOpen(false)

    try {
      await resendEmployeeInvitation(pendingResend.id)
      showToast('Invitation sent successfully')
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to send invitation email'
      showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
    } finally {
      setResendLoadingId(null)
      setPendingResend(null)
    }
  }

  const handleDeleteRequest = (employee) => {
    setPendingDelete(employee)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return

    setDeleteLoadingId(pendingDelete.id)
    setDeleteConfirmOpen(false)

    try {
      await deleteEmployee(pendingDelete.id)
      showToast(`${pendingDelete.fullName} deleted successfully`)
      if (selectedEmployee?.id === pendingDelete.id) {
        setDetailsOpen(false)
        setSelectedEmployee(null)
      }
      await loadEmployees()
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to delete employee'
      showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
    } finally {
      setDeleteLoadingId(null)
      setPendingDelete(null)
    }
  }

  return (
    <div className="employees-page">
      <PageHeader
        title="Employees"
        subtitle="Manage all employees in the organization"
        actions={
          <button type="button" className="btn btn--primary" onClick={openAddModal}>
            + Add Employee
          </button>
        }
      />

      <div className="employees-panel">
        <EmployeeFilters
          search={search}
          department={departmentFilter}
          status={statusFilter}
          departments={departments}
          onSearchChange={setSearch}
          onDepartmentChange={setDepartmentFilter}
          onStatusChange={setStatusFilter}
        />

        <EmployeeTable
          employees={filteredEmployees}
          loading={loading}
          resendLoadingId={resendLoadingId}
          deleteLoadingId={deleteLoadingId}
          onView={openDetails}
          onEdit={openEditModal}
          onToggleStatus={handleToggleRequest}
          onResendInvite={handleResendRequest}
          onDelete={handleDeleteRequest}
        />
      </div>

      <EmployeeFormModal
        open={modalOpen}
        mode={modalMode}
        employee={selectedEmployee}
        departments={departments}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        submitting={submitting}
      />

      <EmployeeDetails
        employee={selectedEmployee}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Deactivate Employee"
        message={`Are you sure you want to deactivate ${pendingToggle?.fullName}? They will no longer be able to access the system.`}
        confirmLabel="Deactivate"
        onConfirm={() => handleToggleConfirm()}
        onCancel={() => {
          setConfirmOpen(false)
          setPendingToggle(null)
        }}
      />

      <ConfirmDialog
        open={resendConfirmOpen}
        title="Resend Invitation"
        message="Are you sure you want to resend invitation email?"
        confirmLabel="Yes, Resend"
        cancelLabel="Cancel"
        variant="primary"
        onConfirm={handleResendConfirm}
        onCancel={() => {
          if (!resendLoadingId) {
            setResendConfirmOpen(false)
            setPendingResend(null)
          }
        }}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Employee"
        message={`Are you sure you want to delete ${pendingDelete?.fullName}? This will permanently remove their account, attendance, and payslip records.`}
        confirmLabel={deleteLoadingId ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (!deleteLoadingId) {
            setDeleteConfirmOpen(false)
            setPendingDelete(null)
          }
        }}
      />
    </div>
  )
}

export default Employees
