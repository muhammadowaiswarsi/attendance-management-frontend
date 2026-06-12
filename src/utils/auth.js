import { TOKEN_KEY, USER_KEY } from './constants'

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY)

export const getStoredUser = () => {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const saveAuthStorage = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const getDashboardPath = (role) =>
  role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'
