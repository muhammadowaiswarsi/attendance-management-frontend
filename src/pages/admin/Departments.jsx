import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createDepartment,
  deleteDepartment,
  enrichWithEmployeeCounts,
  getDepartments,
  updateDepartment,
} from '../../api/departments'
import { getEmployees } from '../../api/employees'
import DeleteDepartmentModal from '../../components/departments/DeleteDepartmentModal'
import DepartmentFormModal from '../../components/departments/DepartmentFormModal'
import DepartmentTable from '../../components/departments/DepartmentTable'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'
import { filterDepartmentsByName } from '../../utils/departments'

const Departments = () => {
  const { showToast } = useToast()

  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [selectedDepartment, setSelectedDepartment] = useState(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)

  const loadDepartments = useCallback(async () => {
    setLoading(true)
    try {
      const [departmentData, employeeData] = await Promise.all([
        getDepartments(),
        getEmployees(),
      ])
      setDepartments(enrichWithEmployeeCounts(departmentData, employeeData))
    } catch {
      showToast('Failed to load departments', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadDepartments()
  }, [loadDepartments])

  const filteredDepartments = useMemo(
    () => filterDepartmentsByName(departments, search),
    [departments, search]
  )

  const openAddModal = () => {
    setModalMode('add')
    setSelectedDepartment(null)
    setModalOpen(true)
  }

  const openEditModal = (department) => {
    setModalMode('edit')
    setSelectedDepartment(department)
    setModalOpen(true)
  }

  const openDeleteModal = (department) => {
    setPendingDelete(department)
    setDeleteOpen(true)
  }

  const handleFormSubmit = async (formData) => {
    setSubmitting(true)
    try {
      if (modalMode === 'add') {
        await createDepartment(formData)
        showToast('Department added successfully')
      } else {
        await updateDepartment(selectedDepartment.id, formData)
        showToast('Department updated successfully')
      }
      setModalOpen(false)
      await loadDepartments()
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        (modalMode === 'add' ? 'Failed to add department' : 'Failed to update department')
      showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return

    setDeleting(true)
    try {
      await deleteDepartment(pendingDelete.id)
      showToast('Department deleted successfully')
      setDeleteOpen(false)
      setPendingDelete(null)
      await loadDepartments()
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to delete department'
      showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="departments-page">
      <PageHeader
        title="Departments"
        subtitle="Organize teams and departments"
        actions={
          <button type="button" className="btn btn--primary" onClick={openAddModal}>
            + Add Department
          </button>
        }
      />

      <div className="employees-panel">
        <div className="department-filters">
          <div className="employee-filters__search">
            <span className="employee-filters__icon">🔍</span>
            <input
              type="text"
              placeholder="Search departments by name..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <DepartmentTable
          departments={filteredDepartments}
          loading={loading}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      </div>

      <DepartmentFormModal
        open={modalOpen}
        mode={modalMode}
        department={selectedDepartment}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        submitting={submitting}
      />

      <DeleteDepartmentModal
        open={deleteOpen}
        department={pendingDelete}
        deleting={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => !deleting && setDeleteOpen(false)}
      />
    </div>
  )
}

export default Departments
