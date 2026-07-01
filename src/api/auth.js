import api from './axios'

export const loginRequest = (email, password) =>
  api.post('/auth/login', { email, password })

export const fetchMe = (config) => api.get('/auth/me', config)

export const setPasswordRequest = (token, password) =>
  api.post('/auth/set-password', { token, password })
