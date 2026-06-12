import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getEmployees } from '../../api/employees'
import {
  downloadPayslip,
  enrichWithEmployees,
  getPayslipById,
  sendPayslipEmail,
} from '../../api/payslips'
import PayslipDetails from '../../components/payslips/PayslipDetails'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useToast } from '../../context/ToastContext'
import { formatPeriod } from '../../utils/payslips'

const AdminPayslipDetail = () => {
  const { id } = useParams()
  const { showToast } = useToast()
  const [payslip, setPayslip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [emailConfirm, setEmailConfirm] = useState(false)

  const loadPayslip = useCallback(async () => {
    setLoading(true)
    try {
      const [data, employees] = await Promise.all([
        getPayslipById(id),
        getEmployees(),
      ])
      setPayslip(enrichWithEmployees([data], employees)[0])
    } catch {
      showToast('Failed to load payslip', 'error')
      setPayslip(null)
    } finally {
      setLoading(false)
    }
  }, [id, showToast])

  useEffect(() => {
    loadPayslip()
  }, [loadPayslip])

  const handleDownload = async (p) => {
    setActionLoading(true)
    try {
      await downloadPayslip(
        p.id,
        `payslip-${p.employeeName}-${p.month}-${p.year}.pdf`
      )
      showToast('Payslip downloaded')
    } catch (err) {
      const message = err.message || err.response?.data?.detail || 'Failed to download payslip'
      showToast(typeof message === 'string' ? message : 'Download failed', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSendEmail = async () => {
    if (!payslip) return
    setEmailConfirm(false)
    setActionLoading(true)
    try {
      await sendPayslipEmail(payslip.id)
      showToast(`Payslip sent to ${payslip.employeeName}`)
      await loadPayslip()
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to send email'
      showToast(typeof message === 'string' ? message : 'Email failed', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="payslips-page payslips-page--detail">
      <PayslipDetails
        payslip={payslip}
        loading={loading}
        actionLoading={actionLoading}
        onDownload={handleDownload}
        onSendEmail={() => setEmailConfirm(true)}
        backLink={
          <Link to="/admin/payslips" className="btn btn--outline">
            ← Back to Payslips
          </Link>
        }
      />

      <ConfirmDialog
        open={emailConfirm}
        title="Send Payslip Email"
        message={
          payslip
            ? `Send payslip for ${formatPeriod(payslip.month, payslip.year)} to ${payslip.employeeName}?`
            : ''
        }
        confirmLabel="Send Email"
        variant="primary"
        onConfirm={handleSendEmail}
        onCancel={() => setEmailConfirm(false)}
      />
    </div>
  )
}

export default AdminPayslipDetail
