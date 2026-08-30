import { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)
const TOKEN_KEY = 'lenuxwood_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }

    api
      .get('/me')
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [])

  const login = async ({ email, password }) => {
    const res = await api.post('/login', { email, password })
    localStorage.setItem(TOKEN_KEY, res.data.token)
    setUser(res.data.user)
    return res.data.user
  }

  const register = async ({ name, email, phone, password }) => {
    const res = await api.post('/register', { name, email, phone, password })
    localStorage.setItem(TOKEN_KEY, res.data.token)
    setUser(res.data.user)
    return res.data.user
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch {
      // le token est peut-être déjà expiré côté serveur, on nettoie quand même localement
    }
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  const updateProfile = async (data) => {
    const res = await api.put('/me/profile', data)
    setUser(res.data)
    return res.data
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>")
  return ctx
}