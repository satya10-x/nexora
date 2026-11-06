import axios from 'axios'
import { demoRequest, isDemoSession } from './demo.js'

const configuredBaseUrl = import.meta.env.VITE_SENTINEL_API_URL
const forceDemoMode = import.meta.env.VITE_SENTINEL_DEMO === 'true'

const client = axios.create({
  baseURL: configuredBaseUrl || '/api',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const request = async (method, url, config = {}) => {
  if (forceDemoMode || isDemoSession()) {
    return demoRequest(method, url, config)
  }

  return client.request({ method, url, ...config })
}

const api = {
  get: (url, config) => request('get', url, config),
  post: (url, data, config) => request('post', url, { ...config, data }),
  patch: (url, data, config) => request('patch', url, { ...config, data }),
  put: (url, data, config) => request('put', url, { ...config, data }),
  delete: (url, config) => request('delete', url, config),
}

export default api
