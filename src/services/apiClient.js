import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined' ? window.localStorage.getItem('gooddocs_auth_token') : ''

  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const responseData = error?.response?.data

    if (responseData instanceof Blob) {
      return responseData.text().then((text) => {
        try {
          const parsed = JSON.parse(text)

          return Promise.reject(
            parsed?.message ||
            parsed?.errors?.file?.[0] ||
            error?.message ||
            'Something went wrong.'
          )
        } catch {
          return Promise.reject(error?.message || 'Something went wrong.')
        }
      })
    }

    const message =
      responseData?.message ||
      responseData?.errors?.file?.[0] ||
      error?.message ||
      'Something went wrong.'

    return Promise.reject(message)
  }
)
