import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEmployees } from '../../api/employees'
import { createPayslip } from '../../api/payslips'
import CreatePayslipForm from '../../components/payslips/CreatePayslipForm'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'

const AdminCreatePayslip = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [employees, setEmployees] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch(() => showToast('Failed to load employees', 'error'))
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
        <CreatePayslipForm
          employees={employees}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>
    </div>
  )
}

export default AdminCreatePayslip
