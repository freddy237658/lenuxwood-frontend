import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
  },
})

// Ajoute automatiquement le token à chaque requête, s'il existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lenuxwood_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Si le token est invalide/expiré, on nettoie proprement côté client
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lenuxwood_token')
    }
    return Promise.reject(error)
  }
)

export default api