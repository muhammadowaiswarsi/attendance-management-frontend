import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getCompanyReport } from '../../api/reports'
import CompanyReport from '../../components/reports/CompanyReport'
import ReportFilters from '../../components/reports/ReportFilters'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import PageHeader from '../../components/ui/PageHeader'
import { useToast } from '../../context/ToastContext'
import { getDefaultMonthYear, getYearOptions } from '../../utils/reports'

const AdminCompanyReport = () => {
  const { showToast } = useToast()
  const defaults = getDefaultMonthYear()

  const [generating, setGenerating] = useState(false)
  const [report, setReport] = useState(null)
  const [generated, setGenerated] = useState(false)

  const [month, setMonth] = useState(String(defaults.month))
  const [year, setYear] = useState(String(defaults.year))
  const years = getYearOptions()

  const handleGenerate = async () => {
    if (!month || !year) {
      showToast('Please select month and year', 'error')
      return
    }

    setGenerating(true)
    setGenerated(false)
    try {
      const data = await getCompanyReport(Number(month), Number(year))
      setReport(data)
      setGenerated(true)
    } catch {
      showToast('Failed to generate company report', 'error')
      setReport(null)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Company Summary Report"
        subtitle="Organization-wide attendance overview"
        actions={
          <Link to="/admin/reports" className="btn btn--outline btn--sm">
            ← All Reports
          </Link>
        }
      />

      <div className="employees-panel">
        <ReportFilters
          month={month}
          year={year}
          years={years}
          onMonthChange={setMonth}
          onYearChange={setYear}
          onSubmit={handleGenerate}
          loading={generating}
        />

        {generating && <LoadingSpinner />}

        {!generating && generated && report && <CompanyReport data={report} />}

        {!generating && generated && !report && (
          <div className="report-empty">
            <span className="report-empty__icon">📭</span>
            <h3>No report data</h3>
            <p>Try selecting a different month or year.</p>
          </div>
        )}

        {!generating && !generated && (
          <div className="report-empty">
            <span className="report-empty__icon">🏢</span>
            <h3>Generate a report</h3>
            <p>Select a month and year, then click Generate Report.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCompanyReport
