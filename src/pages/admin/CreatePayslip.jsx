import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEmployees } from '../../api/employees'
import { getActivePayslipFields } from '../../api/payslipFields'
import { createPayslip } from '../../api/payslips'
import CreatePayslipForm from '../../components/payslips/CreatePayslipForm'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'
import useCachedResource from '../../hooks/useCachedResource'
import {
  CACHE_KEYS,
  cachedFetch,
  invalidateAfterPayslipChange,
} from '../../utils/pageCache'

const AdminCreatePayslip = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const { data, loading } = useCachedResource(
    CACHE_KEYS.createPayslipForm,
    async () => {
      try {
        const [employeeRows, fieldRows] = await Promise.all([
          cachedFetch(CACHE_KEYS.employees, () => getEmployees()),
          cachedFetch(CACHE_KEYS.activePayslipFields, () => getActivePayslipFields()),
        ])
        return { employees: employeeRows, fields: fieldRows }
      } catch {
        showToast('Failed to load payslip form', 'error')
        throw new Error('Failed to load payslip form')
      }
    }
  )

  const employees = data?.employees || []
  const fields = data?.fields || []

  const handleSubmit = async (form) => {
    setSubmitting(true)
    try {
      const payslip = await createPayslip(form)
      invalidateAfterPayslipChange()
      showToast('Payslip created successfully')
      navigate(`/admin/payslips/${payslip.id}`)
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to create payslip'
      showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="payslips-page">
      <PageHeader
        title="Create Payslip"
        subtitle="Generate a new payslip for an employee"
      />

      <div className="employees-panel">
        {loading ? (
          <div className="employee-table-loading">
            <div className="spinner" />
            <p>Loading form...</p>
          </div>
        ) : (
          <CreatePayslipForm
            employees={employees}
            fields={fields}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  )
}

export default AdminCreatePayslip
