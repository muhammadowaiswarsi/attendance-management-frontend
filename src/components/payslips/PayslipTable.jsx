import { formatCurrency, formatPeriod, getPayslipStatus } from '../../utils/payslips'

const PayslipTable = ({
  payslips = [],
  loading,
  actionLoadingId,
  deleteLoadingId = null,
  onView,
  onDownload,
  onSendEmail,
  onDelete,
  showEmployeeInfo = true,
}) => {
  if (loading) {
    return (
      <div className="employee-table-loading">
        <div className="spinner" />
        <p>Loading payslips...</p>
      </div>
    )
  }

  if (payslips.length === 0) {
    return (
      <div className="employee-empty">
        <span className="employee-empty__icon">💰</span>
        <h3>No payslips found</h3>
        <p>Create a payslip or adjust your filters.</p>
      </div>
    )
  }

  return (
    <>
      <div className="employee-table-wrap">
        <table className="employee-table payslip-table">
          <thead>
            <tr>
              {showEmployeeInfo && (
                <>
                  <th>Employee Name</th>
                  <th>Employee Code</th>
                </>
              )}
              <th>Month / Year</th>
              {showEmployeeInfo && (
                <>
                  <th>Basic Salary</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                </>
              )}
              <th>Net Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payslips.map((payslip) => {
              const status = getPayslipStatus(payslip.sentAt)
              const isLoading = actionLoadingId === payslip.id
              const isDeleting = deleteLoadingId === payslip.id

              return (
                <tr key={payslip.id}>
                  {showEmployeeInfo && (
                    <>
                      <td data-label="Employee">{payslip.employeeName}</td>
                      <td data-label="Code">{payslip.employeeCode || '—'}</td>
                    </>
                  )}
                  <td data-label="Period">{formatPeriod(payslip.month, payslip.year)}</td>
                  {showEmployeeInfo && (
                    <>
                      <td data-label="Basic">{formatCurrency(payslip.basicSalary)}</td>
                      <td data-label="Allowances">{formatCurrency(payslip.allowances)}</td>
                      <td data-label="Deductions">{formatCurrency(payslip.deductions)}</td>
                    </>
                  )}
                  <td data-label="Net">{formatCurrency(payslip.netSalary)}</td>
                  <td data-label="Status">
                    <span
                      className={`badge ${
                        status === 'Sent' ? 'badge--success' : 'badge--warning'
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="employee-actions">
                      {onView && (
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() => onView(payslip)}
                        >
                          View
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        disabled={isLoading}
                        onClick={() => onDownload(payslip)}
                      >
                        Download
                      </button>
                      {onSendEmail && (
                        <button
                          type="button"
                          className="btn btn--sm btn--outline"
                          disabled={isLoading || isDeleting}
                          onClick={() => onSendEmail(payslip)}
                        >
                          Send Email
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          className="btn btn--icon-danger btn--sm"
                          onClick={() => onDelete(payslip)}
                          disabled={isLoading || isDeleting}
                          aria-label={`Delete payslip for ${payslip.employeeName}`}
                          title="Delete payslip"
                        >
                          {isDeleting ? '…' : '🗑️'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="payslip-cards">
        {payslips.map((payslip) => {
          const status = getPayslipStatus(payslip.sentAt)
          const isLoading = actionLoadingId === payslip.id
          const isDeleting = deleteLoadingId === payslip.id

          return (
            <div key={payslip.id} className="payslip-card">
              <div className="payslip-card__header">
                <div>
                  <h4>{showEmployeeInfo ? payslip.employeeName : formatPeriod(payslip.month, payslip.year)}</h4>
                  {showEmployeeInfo && <p>{payslip.employeeCode || '—'}</p>}
                </div>
                <span
                  className={`badge ${
                    status === 'Sent' ? 'badge--success' : 'badge--warning'
                  }`}
                >
                  {status}
                </span>
              </div>
              <div className="payslip-card__body">
                {showEmployeeInfo && (
                  <p><span>Period</span>{formatPeriod(payslip.month, payslip.year)}</p>
                )}
                <p><span>Net Salary</span>{formatCurrency(payslip.netSalary)}</p>
                {showEmployeeInfo && (
                  <>
                    <p><span>Basic</span>{formatCurrency(payslip.basicSalary)}</p>
                    <p><span>Deductions</span>{formatCurrency(payslip.deductions)}</p>
                  </>
                )}
              </div>
              <div className="employee-card__actions">
                {onView && (
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => onView(payslip)}>
                    View
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  disabled={isLoading}
                  onClick={() => onDownload(payslip)}
                >
                  Download
                </button>
                {onSendEmail && (
                  <button
                    type="button"
                    className="btn btn--sm btn--outline"
                    disabled={isLoading || isDeleting}
                    onClick={() => onSendEmail(payslip)}
                  >
                    Send Email
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    className="btn btn--icon-danger btn--sm"
                    onClick={() => onDelete(payslip)}
                    disabled={isLoading || isDeleting}
                    aria-label={`Delete payslip for ${payslip.employeeName}`}
                    title="Delete payslip"
                  >
                    {isDeleting ? '…' : '🗑️'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default PayslipTable
