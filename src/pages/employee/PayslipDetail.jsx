import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { downloadPayslip, getMyPayslips } from '../../api/payslips'
import PayslipDetails from '../../components/payslips/PayslipDetails'
import { useToast } from '../../context/ToastContext'

const EmployeePayslipDetail = () => {
  const { id } = useParams()
  const { showToast } = useToast()
  const [payslip, setPayslip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const loadPayslip = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getMyPayslips()
      const found = data.find((p) => String(p.id) === String(id))
      setPayslip(found || null)
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
      await downloadPayslip(p.id, `payslip-${p.month}-${p.year}.pdf`)
      showToast('Payslip downloaded')
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to download payslip'
      showToast(typeof message === 'string' ? message : 'Download failed', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="payslips-page">
      <PayslipDetails
        payslip={payslip}
        loading={loading}
        actionLoading={actionLoading}
        onDownload={handleDownload}
        showSendEmail={false}
        backLink={
          <Link to="/employee/payslips" className="btn btn--outline">
            ← Back to My Payslips
          </Link>
        }
      />
    </div>
  )
}

export default EmployeePayslipDetail
