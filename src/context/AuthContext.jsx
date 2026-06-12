import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fetchMe, loginRequest } from '../api/auth'
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUser,
  saveAuthStorage,
} from '../utils/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser())
  const [token, setToken] = useState(getStoredToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getStoredToken()
      if (!storedToken) {
        setLoading(false)
        return
      }

      try {
        const { data } = await fetchMe()
        setUser(data)
        setToken(storedToken)
        saveAuthStorage(storedToken, data)
      } catch {
        clearAuthStorage()
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    const { data } = await loginRequest(email, password)
    const accessToken = data.access_token

    saveAuthStorage(accessToken, null)
    setToken(accessToken)

    const meResponse = await fetchMe()
    const userData = meResponse.data

    setUser(userData)
    saveAuthStorage(accessToken, userData)

    return userData
  }

  const logout = () => {
    clearAuthStorage()
    setUser(null)
    setToken(null)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      role: user?.role || null,
    }),
    [user, token, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
