import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { fetchMe, loginRequest } from '../api/auth'
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUser,
  saveAuthStorage,
} from '../utils/auth'
import { isPublicAuthPath, setLoginInProgress } from '../utils/authSession'

const AuthContext = createContext(null)

const isAbortError = (error) =>
  error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser())
  const [token, setToken] = useState(getStoredToken())
  const [loading, setLoading] = useState(true)
  const initAbortRef = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    initAbortRef.current = controller

    const initAuth = async () => {
      const storedToken = getStoredToken()
      if (!storedToken) {
        setLoading(false)
        return
      }

      const onPublicAuthPage = isPublicAuthPath()

      if (onPublicAuthPage) {
        setLoading(false)
      }

      try {
        const { data } = await fetchMe({ signal: controller.signal })
        if (controller.signal.aborted) return

        setUser(data)
        setToken(storedToken)
        saveAuthStorage(storedToken, data)
      } catch (error) {
        if (controller.signal.aborted || isAbortError(error)) return

        clearAuthStorage()
        setUser(null)
        setToken(null)
      } finally {
        if (!controller.signal.aborted && !onPublicAuthPage) {
          setLoading(false)
        }
      }
    }

    initAuth()

    return () => {
      controller.abort()
    }
  }, [])

  const login = async (email, password) => {
    initAbortRef.current?.abort()

    setLoginInProgress(true)
    clearAuthStorage()
    setUser(null)
    setToken(null)

    try {
      const { data } = await loginRequest(email, password)
      const accessToken = data.access_token

      saveAuthStorage(accessToken, null)
      setToken(accessToken)

      let meResponse
      try {
        meResponse = await fetchMe()
      } catch {
        clearAuthStorage()
        setUser(null)
        setToken(null)
        const profileError = new Error('Could not load your profile. Please try again.')
        profileError.code = 'PROFILE_LOAD_FAILED'
        throw profileError
      }

      const userData = meResponse.data
      setUser(userData)
      saveAuthStorage(accessToken, userData)

      return userData
    } finally {
      setLoginInProgress(false)
    }
  }

  const logout = () => {
    initAbortRef.current?.abort()
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
