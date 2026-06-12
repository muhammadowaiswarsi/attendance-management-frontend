import { useCallback, useEffect, useState } from 'react'
import {
  createHoliday,
  deleteHoliday,
  getHolidays,
  updateHoliday,
} from '../../api/holidays'
import HolidayFormModal from '../../components/holidays/HolidayFormModal'
import HolidayTable from '../../components/holidays/HolidayTable'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'
import { getYearOptions, sortHolidaysByDate } from '../../utils/holidays'

const AdminHolidays = () => {
  const { showToast } = useToast()
  const yearOptions = getYearOptions()

  const [holidays, setHolidays] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [year, setYear] = useState(String(new Date().getFullYear()))

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [selectedHoliday, setSelectedHoliday] = useState(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)

  const loadHolidays = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getHolidays(Number(year))
      setHolidays(sortHolidaysByDate(data))
    } catch {
      showToast('Failed to load holidays', 'error')
    } finally {
      setLoading(false)
    }
  }, [year, showToast])

  useEffect(() => {
    loadHolidays()
  }, [loadHolidays])

  const openAddModal = () => {
    setModalMode('add')
    setSelectedHoliday(null)
    setModalOpen(true)
  }

  const openEditModal = (holiday) => {
    setModalMode('edit')
    setSelectedHoliday(holiday)
    setModalOpen(true)
  }

  const openDeleteDialog = (holiday) => {
    setPendingDelete(holiday)
    setDeleteOpen(true)
  }

  const handleFormSubmit = async (formData) => {
    setSubmitting(true)
    try {
      if (modalMode === 'add') {
        await createHoliday(formData)
        showToast('Holiday added successfully')
      } else {
        await updateHoliday(selectedHoliday.id, formData)
        showToast('Holiday updated successfully')
      }
      setModalOpen(false)
      await loadHolidays()
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        (modalMode === 'add' ? 'Failed to add holiday' : 'Failed to update holiday')
      showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return

    setDeleting(true)
    try {
      await deleteHoliday(pendingDelete.id)
      showToast('Holiday deleted successfully')
      setDeleteOpen(false)
      setPendingDelete(null)
      await loadHolidays()
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to delete holiday'
      showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="holidays-page">
      <PageHeader
        title="Holidays"
        subtitle="Manage company holidays and official days off"
        actions={
          <button type="button" className="btn btn--primary" onClick={openAddModal}>
            + Add Holiday
          </button>
        }
      />

      <div className="employees-panel">
        <div className="holiday-filters">
          <label htmlFor="holiday-year" className="holiday-filters__label">
            Year
          </label>
          <select
            id="holiday-year"
            className="attendance-filters__select holiday-filters__select"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          >
            {yearOptions.map((optionYear) => (
              <option key={optionYear} value={optionYear}>
                {optionYear}
              </option>
            ))}
          </select>
        </div>

        <HolidayTable
          holidays={holidays}
          loading={loading}
          onEdit={openEditModal}
          onDelete={openDeleteDialog}
        />
      </div>

      <HolidayFormModal
        open={modalOpen}
        mode={modalMode}
        holiday={selectedHoliday}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        submitting={submitting}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Holiday"
        message="Are you sure you want to delete this holiday?"
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => !deleting && setDeleteOpen(false)}
      />
    </div>
  )
}

export default AdminHolidays
