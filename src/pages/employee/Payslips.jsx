import { useCallback, useEffect, useState } from 'react'
import { downloadPayslip, getMyPayslips } from '../../api/payslips'
import EmployeePayslipView from '../../components/payslips/EmployeePayslipView'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'

const EmployeePayslips = () => {
  const { showToast } = useToast()
  const [payslips, setPayslips] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState(null)

  const loadPayslips = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getMyPayslips()
      setPayslips(data.sort((a, b) => b.year - a.year || b.month - a.month))
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to load payslips'
      showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadPayslips()
  }, [loadPayslips])

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
