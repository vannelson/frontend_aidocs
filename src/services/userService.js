import { apiClient } from './apiClient'

export const userService = {
  getShareableUsers() {
    return apiClient.get('/users/shareable')
  },
}
