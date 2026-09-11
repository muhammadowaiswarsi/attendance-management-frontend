import { useCallback, useEffect, useState } from 'react'
import {
  createPayslipField,
  deletePayslipField,
  getPayslipFields,
  reorderPayslipFields,
  updatePayslipField,
} from '../../api/payslipFields'
import PayslipFieldFormModal from '../../components/settings/PayslipFieldFormModal'
import PayslipFieldTable from '../../components/settings/PayslipFieldTable'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'

const AdminSettings = () => {
  const { showToast } = useToast()
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [selectedField, setSelectedField] = useState(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)

  const loadFields = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getPayslipFields()
      setFields(data)
    } catch {
      showToast('Failed to load payslip fields', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadFields()
  }, [loadFields])

  const openAddModal = () => {
    setModalMode('add')
    setSelectedField(null)
    setModalOpen(true)
  }

  const openEditModal = (field) => {
    setModalMode('edit')
    setSelectedField(field)
    setModalOpen(true)
  }

  const openDeleteDialog = (field) => {
    setPendingDelete(field)
    setDeleteOpen(true)
  }

  const handleFormSubmit = async (formData) => {
    setSubmitting(true)
    try {
      if (modalMode === 'add') {
        await createPayslipField(formData)
        showToast('Payslip field added')
      } else {
        await updatePayslipField(selectedField.id, formData)
        showToast('Payslip field updated')
      }
      setModalOpen(false)
      await loadFields()
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        (modalMode === 'add' ? 'Failed to add field' : 'Failed to update field')
      showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggle = async (field) => {
    setTogglingId(field.id)
    try {
      await updatePayslipField(field.id, { isActive: !field.isActive })
      showToast(field.isActive ? `${field.name} disabled` : `${field.name} enabled`)
      await loadFields()
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to update field status'
      showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
    } finally {
      setTogglingId(null)
    }
  }

  const handleMove = async (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= fields.length) return
    const next = [...fields]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    setFields(next)
    try {
      const saved = await reorderPayslipFields(next)
      setFields(saved)
    } catch (err) {
      showToast(
        typeof err.response?.data?.detail === 'string'
          ? err.response.data.detail
          : 'Failed to reorder fields',
        'error'
      )
      await loadFields()
    }
  }

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await deletePayslipField(pendingDelete.id)
      showToast('Payslip field deleted')
      setDeleteOpen(false)
      setPendingDelete(null)
      await loadFields()
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to delete field'
      showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="settings-page">
      <PageHeader
        title="Settings"
        subtitle="Configure organization options used across the system"
      />

      <div className="employees-panel settings-section">
        <div className="settings-section__header">
          <div>
            <h2>Payslip Fields</h2>
            <p>
              Active fields appear on Create Payslip, generated PDFs, and emailed payslips.
              Existing payslips keep the values saved at the time they were created.
            </p>
          </div>
          <button type="button" className="btn btn--primary" onClick={openAddModal}>
            + Add Field
          </button>
        </div>

        <PayslipFieldTable
          fields={fields}
          loading={loading}
          onEdit={openEditModal}
          onToggle={handleToggle}
          onDelete={openDeleteDialog}
          onMove={handleMove}
          togglingId={togglingId}
        />
      </div>

      <PayslipFieldFormModal
        open={modalOpen}
        mode={modalMode}
        field={selectedField}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        submitting={submitting}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Payslip Field"
        message={
          pendingDelete
            ? `Delete "${pendingDelete.name}"? Existing payslips will still show this field and its saved value.`
            : ''
        }
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => !deleting && setDeleteOpen(false)}
      />
    </div>
  )
}

export default AdminSettings
