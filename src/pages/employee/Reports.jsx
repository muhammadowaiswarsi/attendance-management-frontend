import { useCallback, useEffect, useState } from 'react'
import { getEmployeeReports } from '../../api/reports'
import AttendanceProgress from '../../components/reports/AttendanceProgress'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import PageHeader from '../../components/ui/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { formatPercentage } from '../../utils/reports'
import { MONTH_NAMES } from '../../utils/payslips'

const summaryItems = [
  { key: 'presentDays', label: 'Present Days', icon: '✅', accent: 'success' },
  { key: 'absentDays', label: 'Absent Days', icon: '❌', accent: 'danger' },
  { key: 'halfDays', label: 'Half Days', icon: '⏳', accent: 'warning' },
]

const EmployeeReports = () => {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [history, setHistory] = useState([])

  const loadReports = useCallback(async () => {
    if (!user?.email) return

    setLoading(true)
    try {
      const data = await getEmployeeReports(user.email)
      setSummary(data.summary)
      setHistory(data.history)
    } catch {
      showToast('Failed to load your reports', 'error')
    } finally {
      setLoading(false)
    }
  }, [user?.email, showToast])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  if (loading) {
    return <LoadingSpinner fullPage />
  }

  return (
    <div>
      <PageHeader
        title="My Reports"
        subtitle="Your attendance performance summary"
      />

      {!summary ? (
        <div className="employees-panel">
          <div className="report-empty">
            <span className="report-empty__icon">📭</span>
            <h3>No report data available</h3>
            <p>Your attendance reports will appear here once data is recorded.</p>
          </div>
        </div>
      ) : (
        <>
          <section className="dashboard-panel">
            <div className="dashboard-panel__header">
              <h3>Attendance Summary</h3>
              <span className="dashboard-panel__meta">This month</span>
            </div>

            <div className="employee-stats-grid">
              {summaryItems.map((item) => (
                <div
                  key={item.key}
                  className={`employee-stat-card employee-stat-card--${item.accent}`}
                >
                  <span className="employee-stat-card__icon">{item.icon}</span>
                  <div>
                    <p className="employee-stat-card__value">{summary[item.key]}</p>
                    <p className="employee-stat-card__label">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="employee-report-progress">
              <AttendanceProgress
                percentage={summary.attendancePercentage}
                label="Attendance Percentage"
              />
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel__header">
              <h3>Recent Monthly Reports</h3>
            </div>

            {history.length === 0 ? (
              <div className="report-empty report-empty--compact">
                <p>No monthly history available yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Year</th>
                      <th>Attendance Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((row) => (
                      <tr key={`${row.year}-${row.month}`}>
                        <td>{MONTH_NAMES[row.month - 1] || row.month}</td>
                        <td>{row.year}</td>
                        <td>
                          <span className="report-table__percentage">
                            {formatPercentage(row.attendancePercentage)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default EmployeeReports
