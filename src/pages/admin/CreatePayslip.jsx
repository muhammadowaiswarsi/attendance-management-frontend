import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEmployees } from '../../api/employees'
import { getActivePayslipFields } from '../../api/payslipFields'
import { createPayslip } from '../../api/payslips'
import CreatePayslipForm from '../../components/payslips/CreatePayslipForm'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'

const AdminCreatePayslip = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [employees, setEmployees] = useState([])
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([getEmployees(), getActivePayslipFields()])
      .then(([employeeRows, fieldRows]) => {
        if (cancelled) return
        setEmployees(employeeRows)
        setFields(fieldRows)
      })
      .catch(() => {
        if (cancelled) return
        showToast('Failed to load payslip form', 'error')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [showToast])

  const handleSubmit = async (form) => {
    setSubmitting(true)
    try {
      const payslip = await createPayslip(form)
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
