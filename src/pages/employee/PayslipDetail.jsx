import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { downloadPayslip, getMyPayslips } from '../../api/payslips'
import PayslipDetails from '../../components/payslips/PayslipDetails'
import { useToast } from '../../context/ToastContext'
import useCachedResource from '../../hooks/useCachedResource'
import { CACHE_KEYS } from '../../utils/pageCache'

const EmployeePayslipDetail = () => {
  const { id } = useParams()
  const { showToast } = useToast()
  const [actionLoading, setActionLoading] = useState(false)

  const { data: payslips = [], loading } = useCachedResource(
    CACHE_KEYS.myPayslips,
    async () => {
      try {
        const data = await getMyPayslips()
        return data.sort((a, b) => b.year - a.year || b.month - a.month)
      } catch {
        showToast('Failed to load payslip', 'error')
        throw new Error('Failed to load payslip')
      }
    }
  )

  const payslip = payslips.find((p) => String(p.id) === String(id)) || null

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
