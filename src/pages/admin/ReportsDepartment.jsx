import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDepartments } from '../../api/departments'
import { getDepartmentReport } from '../../api/reports'
import DepartmentReport from '../../components/reports/DepartmentReport'
import ReportFilters from '../../components/reports/ReportFilters'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'
import { getDefaultMonthYear, getYearOptions } from '../../utils/reports'

const AdminDepartmentReport = () => {
  const { showToast } = useToast()
  const defaults = getDefaultMonthYear()

  const [departments, setDepartments] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [report, setReport] = useState(null)
  const [generated, setGenerated] = useState(false)

  const [departmentId, setDepartmentId] = useState('')
  const [month, setMonth] = useState(String(defaults.month))
  const [year, setYear] = useState(String(defaults.year))
  const years = getYearOptions()

  const loadDepartments = useCallback(async () => {
    setLoadingOptions(true)
    try {
      const data = await getDepartments()
      setDepartments(data)
    } catch {
      showToast('Failed to load departments', 'error')
    } finally {
      setLoadingOptions(false)
    }
  }, [showToast])

  useEffect(() => {
    loadDepartments()
  }, [loadDepartments])

  const handleGenerate = async () => {
    if (!departmentId || !month || !year) {
      showToast('Please select department, month, and year', 'error')
      return
    }

    setGenerating(true)
    setGenerated(false)
    try {
      const data = await getDepartmentReport(Number(departmentId), Number(month), Number(year))
      setReport(data)
      setGenerated(true)
    } catch {
      showToast('Failed to generate department report', 'error')
      setReport(null)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Department Report"
        subtitle="Department performance and attendance analytics"
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
            showDepartment
            departments={departments}
            departmentId={departmentId}
            month={month}
            year={year}
            years={years}
            onDepartmentChange={setDepartmentId}
            onMonthChange={setMonth}
            onYearChange={setYear}
            onSubmit={handleGenerate}
            loading={generating}
          />
        )}

        {generating && <LoadingSpinner />}

        {!generating && generated && report && <DepartmentReport data={report} />}

        {!generating && generated && !report && (
          <div className="report-empty">
            <span className="report-empty__icon">📭</span>
            <h3>No report data</h3>
            <p>Try selecting a different department or period.</p>
          </div>
        )}

        {!generating && !generated && (
          <div className="report-empty">
            <span className="report-empty__icon">📊</span>
            <h3>Generate a report</h3>
            <p>Select a department and period, then click Generate Report.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDepartmentReport
