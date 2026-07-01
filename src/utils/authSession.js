let loginInProgress = false

export const setLoginInProgress = (value) => {
  loginInProgress = value
}

export const isLoginInProgress = () => loginInProgress

export const isPublicAuthPath = (pathname = window.location.pathname) =>
  ['/login', '/forgot-password', '/reset-password', '/set-password'].some((path) =>
    pathname.startsWith(path)
  )
