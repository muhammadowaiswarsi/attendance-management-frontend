import { Link } from 'react-router-dom'
import { formatCurrency, formatPeriod, getPayslipStatus } from '../../utils/payslips'

const EmployeePayslipView = ({
  payslips = [],
  loading,
  actionLoadingId,
  onDownload,
}) => {
  if (loading) {
    return (
      <div className="employee-table-loading">
        <div className="spinner" />
        <p>Loading your payslips...</p>
      </div>
    )
  }

  if (payslips.length === 0) {
    return (
      <div className="employee-empty">
        <span className="employee-empty__icon">💰</span>
        <h3>No payslips yet</h3>
        <p>Your payslips will appear here once HR generates them.</p>
      </div>
    )
  }

  return (
    <>
      <div className="employee-payslip-grid">
        {payslips.map((payslip) => {
          const status = getPayslipStatus(payslip.sentAt)
          const isLoading = actionLoadingId === payslip.id

          return (
            <div key={payslip.id} className="employee-payslip-card">
              <div className="employee-payslip-card__top">
                <div>
                  <h4>{formatPeriod(payslip.month, payslip.year)}</h4>
                  <p>{formatCurrency(payslip.netSalary)}</p>
                </div>
                <span
                  className={`badge ${
                    status === 'Sent' ? 'badge--success' : 'badge--warning'
                  }`}
                >
                  {status}
                </span>
              </div>
              <div className="employee-payslip-card__actions">
                <Link to={`/employee/payslips/${payslip.id}`} className="btn btn--ghost btn--sm">
                  View
                </Link>
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  disabled={isLoading}
                  onClick={() => onDownload(payslip)}
                >
                  Download
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="employee-table-wrap employee-payslip-table">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Month / Year</th>
              <th>Net Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payslips.map((payslip) => {
              const status = getPayslipStatus(payslip.sentAt)
              const isLoading = actionLoadingId === payslip.id

              return (
                <tr key={payslip.id}>
                  <td>{formatPeriod(payslip.month, payslip.year)}</td>
                  <td>{formatCurrency(payslip.netSalary)}</td>
                  <td>
                    <span
                      className={`badge ${
                        status === 'Sent' ? 'badge--success' : 'badge--warning'
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td>
                    <div className="employee-actions">
                      <Link to={`/employee/payslips/${payslip.id}`} className="btn btn--ghost btn--sm">
                        View
                      </Link>
                      <button
                        type="button"
                        className="btn btn--primary btn--sm"
                        disabled={isLoading}
                        onClick={() => onDownload(payslip)}
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default EmployeePayslipView
