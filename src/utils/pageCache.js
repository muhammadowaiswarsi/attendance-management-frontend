const cache = new Map()
const inflight = new Map()

export const CACHE_KEYS = {
  adminDashboard: 'admin-dashboard',
  employeeDashboard: 'employee-dashboard',
  employees: 'employees',
  departments: 'departments',
  payslips: 'payslips',
  payslip: (id) => `payslip:${id}`,
  myPayslips: 'my-payslips',
  departmentsPage: 'departments-page',
  myAttendance: 'my-attendance',
  profile: 'profile',
  payslipFields: 'payslip-fields',
  activePayslipFields: 'payslip-fields-active',
  createPayslipForm: 'create-payslip-form',
  holidays: (year) => `holidays:${year}`,
  attendance: (date) => `attendance:${date}`,
  employeeReports: (email) => `employee-reports:${email}`,
}

export const getPageCache = (key) => cache.get(key)

export const setPageCache = (key, value) => {
  cache.set(key, value)
  return value
}

export const hasPageCache = (key) => cache.has(key)

export const clearPageCache = () => {
  cache.clear()
  inflight.clear()
}

export const invalidatePageCache = (keyOrPrefix) => {
  if (!keyOrPrefix) {
    clearPageCache()
    return
  }
  for (const key of [...cache.keys()]) {
    if (key === keyOrPrefix || key.startsWith(`${keyOrPrefix}:`)) {
      cache.delete(key)
      inflight.delete(key)
    }
  }
}

export const invalidateMany = (...keys) => {
  keys.forEach((key) => invalidatePageCache(key))
}

export const invalidateAfterAttendanceChange = () => {
  invalidateMany(
    CACHE_KEYS.adminDashboard,
    CACHE_KEYS.employeeDashboard,
    CACHE_KEYS.myAttendance,
    'attendance',
    'employee-reports'
  )
}

export const invalidateAfterEmployeeChange = () => {
  invalidateMany(
    CACHE_KEYS.employees,
    CACHE_KEYS.adminDashboard,
    CACHE_KEYS.departments,
    CACHE_KEYS.departmentsPage,
    CACHE_KEYS.createPayslipForm,
    'attendance',
    'employee-reports'
  )
}

export const invalidateAfterDepartmentChange = () => {
  invalidateMany(
    CACHE_KEYS.departments,
    CACHE_KEYS.departmentsPage,
    CACHE_KEYS.employees,
    CACHE_KEYS.adminDashboard,
    CACHE_KEYS.createPayslipForm,
    'attendance'
  )
}

export const invalidateAfterHolidayChange = () => {
  invalidatePageCache('holidays')
}

export const invalidateAfterPayslipChange = () => {
  invalidateMany(
    CACHE_KEYS.payslips,
    CACHE_KEYS.myPayslips,
    CACHE_KEYS.employeeDashboard,
    CACHE_KEYS.adminDashboard,
    'payslip'
  )
}

export const invalidateAfterPayslipFieldsChange = () => {
  invalidateMany(
    CACHE_KEYS.payslipFields,
    CACHE_KEYS.activePayslipFields,
    CACHE_KEYS.createPayslipForm
  )
}

export const invalidateAfterProfileChange = () => {
  invalidateMany(CACHE_KEYS.employeeDashboard, CACHE_KEYS.adminDashboard)
}

export const cachedFetch = async (key, loader, { force = false } = {}) => {
  if (!force && cache.has(key)) {
    return cache.get(key)
  }
  if (!force && inflight.has(key)) {
    return inflight.get(key)
  }

  const request = Promise.resolve()
    .then(loader)
    .then((data) => {
      cache.set(key, data)
      inflight.delete(key)
      return data
    })
    .catch((error) => {
      inflight.delete(key)
      throw error
    })

  inflight.set(key, request)
  return request
}
