import ReportCard from '../../components/reports/ReportCard'
import PageHeader from '../../components/ui/PageHeader'

const REPORT_CATEGORIES = [
  {
    icon: '👤',
    title: 'Monthly Employee Report',
    description: 'View individual employee attendance breakdown for any month.',
    to: '/admin/reports/monthly',
    accent: 'primary',
  },
  {
    icon: '🏢',
    title: 'Company Summary Report',
    description: 'Organization-wide attendance metrics and overall performance.',
    to: '/admin/reports/company',
    accent: 'success',
  },
  {
    icon: '📊',
    title: 'Department Report',
    description: 'Department-level analytics with top performer insights.',
    to: '/admin/reports/department',
    accent: 'warning',
  },
]

const AdminReports = () => {
  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Analytics and attendance insights for your organization"
      />

      <div className="reports-grid reports-grid--three">
        {REPORT_CATEGORIES.map((category) => (
          <ReportCard
            key={category.title}
            icon={category.icon}
            title={category.title}
            description={category.description}
            to={category.to}
            accent={category.accent}
          />
        ))}
      </div>
    </div>
  )
}

export default AdminReports
