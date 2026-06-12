import { Link } from 'react-router-dom'

const PayslipSummary = ({ summary }) => {
  if (!summary) return null

  return (
    <div className="payslip-summary">
      <div className="payslip-summary__stats">
        <div className="payslip-summary__item">
          <span className="payslip-summary__value">{summary.totalThisMonth}</span>
          <span className="payslip-summary__label">Total This Month</span>
        </div>
        <div className="payslip-summary__item">
          <span className="payslip-summary__value payslip-summary__value--success">
            {summary.sent}
          </span>
          <span className="payslip-summary__label">Sent</span>
        </div>
        <div className="payslip-summary__item">
          <span className="payslip-summary__value payslip-summary__value--warning">
            {summary.pending}
          </span>
          <span className="payslip-summary__label">Pending</span>
        </div>
      </div>
      <Link to="/admin/payslips" className="btn btn--primary btn--sm">
        Create Payslip
      </Link>
    </div>
  )
}

export default PayslipSummary
