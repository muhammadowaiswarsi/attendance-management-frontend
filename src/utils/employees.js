export const canResendInvitation = (employee) =>
  Boolean(employee && (!employee.isActive || !employee.passwordSet))
