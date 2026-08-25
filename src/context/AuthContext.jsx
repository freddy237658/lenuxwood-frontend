import { createContext, useContext, useEffect, useState } from 'react'

/**
 * ⚠️ AUTHENTIFICATION FACTICE (MOCK)
 * ----------------------------------
 * Ce contexte simule une authentification en attendant le back-end Laravel.
 * Toute la logique ci-dessous (localStorage, détection de rôle par email...)
 * devra être remplacée par de vrais appels à l'API Laravel Sanctum :
 *   - POST /api/login          -> retourne un token + l'utilisateur
 *   - POST /api/register       -> crée le compte
 *   - POST /api/logout         -> invalide le token
 *   - GET  /api/user           -> utilisateur courant (via token en cookie/header)
 *
 * Le rôle admin est ici déterminé par un heuristique simple (email contenant
 * "admin") uniquement pour pouvoir démontrer le panel admin sans back-end.
 * Cette logique DOIT être supprimée une fois l'API branchée : le rôle doit
 * venir du back-end, jamais être déduit côté client.
 */

const AuthContext = createContext(null)
const STORAGE_KEY = 'lenuxwood_user'

function fakeDelay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  const persist = (nextUser) => {
    setUser(nextUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
  }

  // TODO: remplacer par POST /api/login (Laravel Sanctum)
  const login = async ({ email, password }) => {
    await fakeDelay()
    if (!email || !password) {
      throw new Error('Identifiants invalides')
    }
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'client'
    const nextUser = {
      name: email.split('@')[0],
      email,
      role,
    }
    persist(nextUser)
    return nextUser
  }

  // TODO: remplacer par POST /api/register (Laravel Sanctum)
  const register = async ({ name, email, phone, password }) => {
    await fakeDelay()
    if (!name || !email || !password) {
      throw new Error('Champs manquants')
    }
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'client'
    const nextUser = { name, email, phone, role }
    persist(nextUser)
    return nextUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  // TODO: remplacer par PUT `${VITE_API_URL}/user/profile`
  const updateProfile = async (data) => {
    await fakeDelay(400)
    const nextUser = { ...user, ...data }
    persist(nextUser)
    return nextUser
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
  if (!ctx) throw new Error('useAuth doit être utilisé à l\'intérieur de <AuthProvider>')
  return ctx
}
