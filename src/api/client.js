import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
const TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10)

const client = axios.create({
  baseURL: API_BASE,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

let store = {
  getToken: () => null,
  onUnauthorized: () => {}
}

export function attachTokenStore(tokenStore){
  store = tokenStore
}

client.interceptors.request.use((config) => {
  const token = store.getToken && store.getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      // call handler
      try { store.onUnauthorized && store.onUnauthorized() } catch(e){}
    }
    return Promise.reject(error)
  }
)

export default client
