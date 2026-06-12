import companyLogo from '../../assets/companylogo.png'
import {
  formatAmount,
  formatPayslipMonth,
  formatPayslipNumber,
  getPayslipStatus,
} from '../../utils/payslips'

const COMPANY_ADDRESS =
  'Faiyaz Center, Office No: 08, Shahrah-e-Faisal Rd, SMCHS Block A, Karachi, Pakistan'

const PayslipDetails = ({
  payslip,
  loading,
  actionLoading,
  onDownload,
  onSendEmail,
  showSendEmail = true,
  backLink,
}) => {
  if (loading) {
    return (
      <div className="employee-table-loading">
        <div className="spinner" />
        <p>Loading payslip...</p>
      </div>
    )
  }

  if (!payslip) {
    return (
      <div className="employee-empty">
        <h3>Payslip not found</h3>
        {backLink}
      </div>
    )
  }

  const status = getPayslipStatus(payslip.sentAt)

  return (
    <div className="payslip-document-wrap">
      <div className="payslip-document-wrap__toolbar">
        {backLink}
        <span className={`badge ${status === 'Sent' ? 'badge--success' : 'badge--warning'}`}>
          {status}
        </span>
      </div>

      <article className="payslip-document">
        <h1 className="payslip-document__title">PAYSLIP</h1>

        <div className="payslip-document__top">
          <div className="payslip-document__brand">
            <img src={companyLogo} alt="Computing Yard" className="payslip-document__logo" />
            <p className="payslip-document__address">{COMPANY_ADDRESS}</p>
          </div>
          <div className="payslip-document__meta">
            <p className="payslip-document__meta-id">
              <span>Payslip#</span>{' '}
              <strong>{formatPayslipNumber(payslip.id)}</strong>
            </p>
            <p className="payslip-document__month">
              Salary Month of {formatPayslipMonth(payslip.month, payslip.year)}
            </p>
          </div>
        </div>

        <div className="payslip-document__employee">
          <p><strong>Name :</strong> {payslip.employeeName}</p>
          <p><strong>Designation :</strong> {payslip.designation || '—'}</p>
          <p><strong>Employee ID :</strong> # {payslip.employeeCode || '—'}</p>
        </div>

        <div className="payslip-document__tables">
          <div className="payslip-document__table-block">
            <table className="payslip-document__table">
              <thead>
                <tr>
                  <th colSpan={2}>Earnings</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic Salary</td>
                  <td>{formatAmount(payslip.basicSalary)}</td>
                </tr>
                <tr>
                  <td>Bonus</td>
                  <td>{formatAmount(payslip.allowances)}</td>
                </tr>
                <tr>
                  <td>Over Time</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="payslip-document__table-block">
            <table className="payslip-document__table">
              <thead>
                <tr>
                  <th colSpan={2}>Deductions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tax Deduction</td>
                  <td>{formatAmount(payslip.deductions)}</td>
                </tr>
                <tr>
                  <td>PF</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Loan</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="payslip-document__net">
          Net Salary : {formatAmount(payslip.netSalary)}/-
        </p>

        <p className="payslip-document__note">
          Note: This is a system generated receipt and will only be valid with proper signed
          and stamped by COMPUTING YARD.
        </p>
      </article>

      <div className="payslip-document__actions">
        <button
          type="button"
          className="btn btn--outline"
          disabled={actionLoading}
          onClick={() => onDownload(payslip)}
        >
          {actionLoading ? 'Please wait...' : 'Download PDF'}
        </button>
        {showSendEmail && onSendEmail && (
          <button
            type="button"
            className="btn btn--primary"
            disabled={actionLoading}
            onClick={() => onSendEmail(payslip)}
          >
            Send Email
          </button>
        )}
      </div>
    </div>
  )
}

export default PayslipDetails
