import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getEmployees } from '../../api/employees'
import {
  deletePayslip,
  downloadPayslip,
  enrichWithEmployees,
  getPayslips,
  sendPayslipEmail,
} from '../../api/payslips'
import PayslipFilters from '../../components/payslips/PayslipFilters'
import PayslipTable from '../../components/payslips/PayslipTable'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'
import { formatPeriod, paginate } from '../../utils/payslips'

const PAGE_SIZE = 10

const AdminPayslips = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const now = new Date()

  const [payslips, setPayslips] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [deleteLoadingId, setDeleteLoadingId] = useState(null)

  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [emailConfirm, setEmailConfirm] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [payslipData, employeeData] = await Promise.all([
        getPayslips(),
        getEmployees(),
      ])
      setEmployees(employeeData)
      setPayslips(enrichWithEmployees(payslipData, employeeData))
    } catch {
      showToast('Failed to load payslips', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    setPage(1)
  }, [month, year, search])

  const years = useMemo(() => {
    const set = new Set(payslips.map((p) => p.year))
    set.add(now.getFullYear())
    return [...set].sort((a, b) => b - a)
  }, [payslips, now])

  const filtered = useMemo(() => {
    return payslips.filter((p) => {
      const matchesMonth = !month || String(p.month) === month
      const matchesYear = !year || String(p.year) === year
      const matchesSearch =
        !search.trim() ||
        p.employeeName?.toLowerCase().includes(search.toLowerCase())
      return matchesMonth && matchesYear && matchesSearch
    })
  }, [payslips, month, year, search])

  const paginated = useMemo(
    () => paginate(filtered, page, PAGE_SIZE),
    [filtered, page]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const handleDownload = async (payslip) => {
    setActionLoadingId(payslip.id)
    try {
      await downloadPayslip(
        payslip.id,
        `payslip-${payslip.employeeName}-${payslip.month}-${payslip.year}.pdf`
      )
      showToast('Payslip downloaded')
    } catch (err) {
      const message = err.message || err.response?.data?.detail || 'Failed to download payslip'
      showToast(typeof message === 'string' ? message : 'Download failed', 'error')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleSendEmail = async () => {
    if (!emailConfirm) return
    setActionLoadingId(emailConfirm.id)
    setEmailConfirm(null)
    try {
      await sendPayslipEmail(emailConfirm.id)
      showToast(`Payslip sent to ${emailConfirm.employeeName}`)
      await loadData()
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to send email'
      showToast(typeof message === 'string' ? message : 'Email failed', 'error')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDeleteRequest = (payslip) => {
    setDeleteConfirm(payslip)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return

    const payslip = deleteConfirm
    setDeleteLoadingId(payslip.id)
    setDeleteConfirm(null)

    try {
      await deletePayslip(payslip.id)
      showToast(`Payslip deleted for ${payslip.employeeName}`)
      await loadData()
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to delete payslip'
      showToast(typeof message === 'string' ? message : 'Delete failed', 'error')
    } finally {
      setDeleteLoadingId(null)
    }
  }

  return (
    <div className="payslips-page">
      <PageHeader
        title="Payslips"
        subtitle="Generate and manage employee payslips"
        actions={
          <Link to="/admin/payslips/create" className="btn btn--primary">
            Create Payslip
          </Link>
        }
      />

      <div className="employees-panel">
        <PayslipFilters
          month={month}
          year={year}
          search={search}
          years={years}
          onMonthChange={setMonth}
          onYearChange={setYear}
          onSearchChange={setSearch}
        />

        <PayslipTable
          payslips={paginated}
          loading={loading}
          actionLoadingId={actionLoadingId}
          deleteLoadingId={deleteLoadingId}
          onView={(p) => navigate(`/admin/payslips/${p.id}`)}
          onDownload={handleDownload}
          onSendEmail={setEmailConfirm}
          onDelete={handleDeleteRequest}
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

      <ConfirmDialog
        open={!!emailConfirm}
        title="Send Payslip Email"
        message={
          emailConfirm
            ? `Send payslip for ${formatPeriod(emailConfirm.month, emailConfirm.year)} to ${emailConfirm.employeeName}?`
            : ''
        }
        confirmLabel="Send Email"
        variant="primary"
        onConfirm={handleSendEmail}
        onCancel={() => setEmailConfirm(null)}
      />

      <ConfirmDialog
        open={!!deleteConfirm}
        title="Delete Payslip"
        message={
          deleteConfirm
            ? `Delete payslip for ${deleteConfirm.employeeName} (${formatPeriod(deleteConfirm.month, deleteConfirm.year)})? This action cannot be undone.`
            : ''
        }
        confirmLabel={deleteLoadingId ? 'Deleting...' : 'Delete'}
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (!deleteLoadingId) {
            setDeleteConfirm(null)
          }
        }}
      />
    </div>
  )
}

export default AdminPayslips
