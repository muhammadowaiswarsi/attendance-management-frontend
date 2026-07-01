import axios from 'axios'
import { clearAuthStorage, getStoredToken } from '../utils/auth'
import { isLoginInProgress } from '../utils/authSession'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const shouldClearAuthOn401 = (error) => {
  if (isLoginInProgress()) return false
  if (error.code === 'ERR_CANCELED') return false

  const url = error.config?.url || ''
  if (url.includes('/auth/login')) return false

  return true
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && shouldClearAuthOn401(error)) {
      clearAuthStorage()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
