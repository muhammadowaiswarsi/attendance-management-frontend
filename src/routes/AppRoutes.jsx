import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import ProtectedRoute from '../components/protected/ProtectedRoute'
import Login from '../pages/Login'
import SetPassword from '../pages/SetPassword'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import AdminDashboard from '../pages/admin/Dashboard'
import AdminEmployees from '../pages/admin/Employees'
import AdminDepartments from '../pages/admin/Departments'
import AdminAttendance from '../pages/admin/Attendance'
import AdminBulkAttendance from '../pages/admin/BulkAttendance'
import AdminHolidays from '../pages/admin/Holidays'
import AdminPayslips from '../pages/admin/Payslips'
import AdminCreatePayslip from '../pages/admin/CreatePayslip'
import AdminPayslipDetail from '../pages/admin/PayslipDetail'
import AdminReports from '../pages/admin/Reports'
import AdminReportsMonthly from '../pages/admin/ReportsMonthly'
import AdminReportsCompany from '../pages/admin/ReportsCompany'
import AdminReportsDepartment from '../pages/admin/ReportsDepartment'
import AdminProfile from '../pages/admin/Profile'
import EmployeeDashboard from '../pages/employee/Dashboard'
import EmployeeAttendance from '../pages/employee/Attendance'
import EmployeePayslips from '../pages/employee/Payslips'
import EmployeePayslipDetail from '../pages/employee/PayslipDetail'
import EmployeeReports from '../pages/employee/Reports'
import EmployeeHolidays from '../pages/employee/Holidays'
import EmployeeProfile from '../pages/employee/Profile'
import NotFound from '../pages/NotFound'
import Unauthorized from '../pages/Unauthorized'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Navigate to="/login" replace />} />
      <Route path="/set-password/:token" element={<SetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="attendance/mark" element={<AdminBulkAttendance />} />
          <Route path="holidays" element={<AdminHolidays />} />
          <Route path="payslips" element={<AdminPayslips />} />
          <Route path="payslips/create" element={<AdminCreatePayslip />} />
          <Route path="payslips/:id" element={<AdminPayslipDetail />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="reports/monthly" element={<AdminReportsMonthly />} />
          <Route path="reports/company" element={<AdminReportsCompany />} />
          <Route path="reports/department" element={<AdminReportsDepartment />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
        <Route path="/employee" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="attendance" element={<Navigate to="attendance/my" replace />} />
          <Route path="attendance/my" element={<EmployeeAttendance />} />
          <Route path="payslips" element={<EmployeePayslips />} />
          <Route path="payslips/:id" element={<EmployeePayslipDetail />} />
          <Route path="reports" element={<EmployeeReports />} />
          <Route path="holidays" element={<EmployeeHolidays />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
