import { apiClient } from './apiClient'

export const authService = {
  register(payload) {
    return apiClient.post('/auth/register', payload)
  },
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },
  me() {
    return apiClient.get('/auth/me')
  },
  logout() {
    return apiClient.post('/auth/logout')
  },
}
