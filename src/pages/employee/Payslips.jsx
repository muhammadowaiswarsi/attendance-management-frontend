import { useState } from 'react'
import { downloadPayslip, getMyPayslips } from '../../api/payslips'
import EmployeePayslipView from '../../components/payslips/EmployeePayslipView'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'
import useCachedResource from '../../hooks/useCachedResource'
import { CACHE_KEYS } from '../../utils/pageCache'

const EmployeePayslips = () => {
  const { showToast } = useToast()
  const [actionLoadingId, setActionLoadingId] = useState(null)

  const { data: payslips = [], loading } = useCachedResource(
    CACHE_KEYS.myPayslips,
    async () => {
      try {
        const data = await getMyPayslips()
        return data.sort((a, b) => b.year - a.year || b.month - a.month)
      } catch (err) {
        const message = err.response?.data?.detail || 'Failed to load payslips'
        showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
        throw err
      }
    }
  )

  const handleDownload = async (payslip) => {
    setActionLoadingId(payslip.id)
    try {
      await downloadPayslip(
        payslip.id,
        `payslip-${payslip.month}-${payslip.year}.pdf`
      )
      showToast('Payslip downloaded')
    } catch (err) {
      const message = err.message || err.response?.data?.detail || 'Failed to download payslip'
      showToast(typeof message === 'string' ? message : 'Download failed', 'error')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="payslips-page">
      <PageHeader title="My Payslips" subtitle="Download your salary payslips" />
      <EmployeePayslipView
        payslips={payslips}
        loading={loading}
        actionLoadingId={actionLoadingId}
        onDownload={handleDownload}
      />
    </div>
  )
}

export default EmployeePayslips
