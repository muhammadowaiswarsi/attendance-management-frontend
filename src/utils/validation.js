export const validateEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(email)
}

export const validateLoginForm = ({ email, password }) => {
  const errors = {}

  if (!email?.trim()) {
    errors.email = 'Email is required'
  } else if (!validateEmail(email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!password) {
    errors.password = 'Password is required'
  }

  return errors
}

export const validateSetPasswordForm = ({ password, confirmPassword }) => {
  const errors = {}

  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

export const validateChangePasswordForm = ({
  currentPassword,
  newPassword,
  confirmPassword,
}) => {
  const errors = {}

  if (!currentPassword) {
    errors.currentPassword = 'Current password is required'
  }

  if (!newPassword) {
    errors.newPassword = 'New password is required'
  } else if (newPassword.length < 8) {
    errors.newPassword = 'Password must be at least 8 characters'
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  if (
    currentPassword &&
    newPassword &&
    currentPassword === newPassword &&
    !errors.newPassword
  ) {
    errors.newPassword = 'New password cannot be the same as the current password'
  }

  return errors
}

export const validateEmployeeForm = (data, { isEdit = false } = {}) => {
  const errors = {}

  if (!data.fullName?.trim()) {
    errors.fullName = 'Full name is required'
  }

  if (!isEdit) {
    if (!data.email?.trim()) {
      errors.email = 'Email is required'
    } else if (!validateEmail(data.email)) {
      errors.email = 'Enter a valid email address'
    }
  }

  if (!data.departmentId) {
    errors.departmentId = 'Department is required'
  }

  if (!data.joiningDate) {
    errors.joiningDate = 'Joining date is required'
  }

  if (!data.salary && data.salary !== 0) {
    errors.salary = 'Salary is required'
  } else if (Number(data.salary) <= 0) {
    errors.salary = 'Salary must be greater than 0'
  }

  return errors
}
