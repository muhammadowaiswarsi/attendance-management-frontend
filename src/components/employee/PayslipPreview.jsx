import { Link } from 'react-router-dom'

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const PayslipPreview = ({ payslips = [] }) => {
  const preview = payslips.slice(0, 3)

  if (preview.length === 0) {
    return (
      <div className="dashboard-table__empty dashboard-table__empty--panel">
        No payslips available yet.
      </div>
    )
  }

  return (
    <div className="payslip-preview">
      <div className="payslip-preview__list">
        {preview.map((payslip) => (
          <div key={payslip.id} className="payslip-preview__card">
            <div>
              <p className="payslip-preview__period">
                {monthNames[payslip.month - 1]} {payslip.year}
              </p>
              <p className="payslip-preview__salary">
                Rs. {payslip.netSalary.toLocaleString()}
              </p>
              <span
                className={`badge ${
                  payslip.status === 'Sent' ? 'badge--success' : 'badge--warning'
                }`}
              >
                {payslip.status}
              </span>
            </div>
            <Link to={`/employee/payslips/${payslip.id}`} className="btn btn--outline btn--sm">
              View
            </Link>
          </div>
        ))}
      </div>
      <Link to="/employee/payslips" className="payslip-preview__link">
        View All →
      </Link>
    </div>
  )
}

export default PayslipPreview
