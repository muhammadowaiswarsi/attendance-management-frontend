import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getEmployees } from '../../api/employees'
import { getMonthlyReport } from '../../api/reports'
import MonthlyReport from '../../components/reports/MonthlyReport'
import ReportFilters from '../../components/reports/ReportFilters'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'
import { getDefaultMonthYear, getYearOptions } from '../../utils/reports'

const AdminMonthlyReport = () => {
  const { showToast } = useToast()
  const defaults = getDefaultMonthYear()

  const [employees, setEmployees] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [report, setReport] = useState(null)
  const [generated, setGenerated] = useState(false)

  const [employeeId, setEmployeeId] = useState('')
  const [month, setMonth] = useState(String(defaults.month))
  const [year, setYear] = useState(String(defaults.year))
  const years = getYearOptions()

  const loadEmployees = useCallback(async () => {
    setLoadingOptions(true)
    try {
      const data = await getEmployees()
      setEmployees(data)
    } catch {
      showToast('Failed to load employees', 'error')
    } finally {
      setLoadingOptions(false)
    }
  }, [showToast])

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  const handleGenerate = async () => {
    if (!employeeId || !month || !year) {
      showToast('Please select employee, month, and year', 'error')
      return
    }

    setGenerating(true)
    setGenerated(false)
    try {
      const data = await getMonthlyReport(Number(employeeId), Number(month), Number(year))
      setReport(data)
      setGenerated(true)
    } catch {
      showToast('Failed to generate monthly report', 'error')
      setReport(null)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Monthly Employee Report"
        subtitle="Individual attendance breakdown by employee"
        actions={
          <Link to="/admin/reports" className="btn btn--outline btn--sm">
            ← All Reports
          </Link>
        }
      />

      <div className="employees-panel">
        {loadingOptions ? (
          <LoadingSpinner />
        ) : (
          <ReportFilters
            showEmployee
            employees={employees}
            employeeId={employeeId}
            month={month}
            year={year}
            years={years}
            onEmployeeChange={setEmployeeId}
            onMonthChange={setMonth}
            onYearChange={setYear}
            onSubmit={handleGenerate}
            loading={generating}
          />
        )}

        {generating && <LoadingSpinner />}

        {!generating && generated && report && <MonthlyReport data={report} />}

        {!generating && generated && !report && (
          <div className="report-empty">
            <span className="report-empty__icon">📭</span>
            <h3>No report data</h3>
            <p>Try selecting a different employee or period.</p>
          </div>
        )}

        {!generating && !generated && (
          <div className="report-empty">
            <span className="report-empty__icon">📊</span>
            <h3>Generate a report</h3>
            <p>Select an employee and period, then click Generate Report.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminMonthlyReport
