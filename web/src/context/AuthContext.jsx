import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const USERS_STORAGE_KEY = 'agrisync_registered_users_v1'
const SESSION_STORAGE_KEY = 'agrisync_active_session_v1'

export const MOCK_USERS = {
  farmer: {
    id: '29b9b72f-0d43-4a23-9b04-dc9e14180f2a',
    name: 'Rajesh Patil (Farmer)',
    email: 'farmer@agrisync.in',
    role: 'farmer',
    roleLabel: 'Farmer Producer (FPO)',
    apmc: 'Nashik APMC, MH',
    phone: '+91 98231 44210',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  },
  procurement_operator: {
    id: 'usr_procurement_operator',
    name: 'Sanjay Deshmukh',
    email: 'operator@agrisync.in',
    role: 'procurement_operator',
    roleLabel: 'Procurement Centre Operator',
    apmc: 'Pimpalgaon Baswant APMC',
    phone: '+91 94220 18400',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
  },
  buyer: {
    id: 'usr_buyer_institutional',
    name: 'Vikram Mehta',
    email: 'buyer@agrisync.in',
    role: 'buyer',
    roleLabel: 'Institutional Buyer (Maharshi Agro)',
    apmc: 'APEDA Nashik / Mumbai',
    phone: '+91 98200 55100',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
  },
  admin: {
    id: 'usr_admin_system',
    name: 'Admin User',
    email: 'admin@agrisync.in',
    role: 'admin',
    roleLabel: 'System Administrator',
    apmc: 'National AgriSync Headquarters',
    phone: '+91 11 2345 6789',
    avatar: '',
  }
}

const loadRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveRegisteredUser = (userObj) => {
  try {
    const users = loadRegisteredUsers()
    const filtered = users.filter((u) => u.email.toLowerCase() !== userObj.email.toLowerCase())
    const updated = [userObj, ...filtered]
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated))
  } catch {}
}

const loadActiveSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { user: MOCK_USERS.farmer, access_token: 'default-session-token' }
}

const saveActiveSession = (sess) => {
  try {
    if (!sess) {
      localStorage.removeItem(SESSION_STORAGE_KEY)
    } else {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sess))
    }
  } catch {}
}

export function AuthProvider({ children }) {
  const [sessionState, setSessionState] = useState(() => loadActiveSession())
  const [user, setUser] = useState(() => sessionState?.user || MOCK_USERS.farmer)
  const [session, setSession] = useState(() => sessionState || null)
  const [language, setLanguage] = useState('EN')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const current = loadActiveSession()
    if (current) {
      setUser(current.user)
      setSession(current)
    }
    setLoading(false)
  }, [])

  const switchRole = (newRole) => {
    if (MOCK_USERS[newRole]) {
      const selected = MOCK_USERS[newRole]
      const sessObj = { user: selected, access_token: `token_${Date.now()}` }
      setUser(selected)
      setSession(sessObj)
      saveActiveSession(sessObj)
      localStorage.setItem('agrisync_role', newRole)
    }
  }

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase()

    // Check registered accounts
    const users = loadRegisteredUsers()
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail)
    if (found) {
      if (found.password !== password) {
        throw new Error('Incorrect password. Please verify your credentials.')
      }
      const userObj = { id: found.id, email: found.email, name: found.name, role: found.role || 'farmer' }
      const sessObj = { user: userObj, access_token: `token_${Date.now()}` }
      setUser(userObj)
      setSession(sessObj)
      saveActiveSession(sessObj)
      return { user: userObj }
    }

    // Try backend API login
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    try {
      const res = await fetch(`${backendUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      })

      if (res.ok) {
        const data = await res.json()
        const userObj = data.user || { id: `usr_${Date.now()}`, email: cleanEmail, name: cleanEmail.split('@')[0], role: 'farmer' }
        const sessObj = { user: userObj, access_token: data.accessToken || `token_${Date.now()}` }
        setUser(userObj)
        setSession(sessObj)
        saveActiveSession(sessObj)
        saveRegisteredUser({ id: userObj.id, name: userObj.name, email: cleanEmail, password, role: userObj.role })
        return { user: userObj }
      }
    } catch {}

    // Fallback demo logins
    for (const key of Object.keys(MOCK_USERS)) {
      if (cleanEmail === MOCK_USERS[key].email.toLowerCase()) {
        const sessObj = { user: MOCK_USERS[key], access_token: `token_${Date.now()}` }
        setUser(MOCK_USERS[key])
        setSession(sessObj)
        saveActiveSession(sessObj)
        return { user: MOCK_USERS[key] }
      }
    }

    // Generic fallback user login
    const defaultUser = { id: `usr_${Date.now()}`, email: cleanEmail, name: cleanEmail.split('@')[0], role: 'farmer' }
    const sessObj = { user: defaultUser, access_token: `token_${Date.now()}` }
    setUser(defaultUser)
    setSession(sessObj)
    saveActiveSession(sessObj)
    return { user: defaultUser }
  }

  const register = async (name, email, password, role = 'farmer') => {
    const cleanEmail = email.trim().toLowerCase()
    const cleanName = name.trim()

    const users = loadRegisteredUsers()
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail)
    if (existing) {
      throw new Error('An account with this email already exists. Please Sign In.')
    }

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      email: cleanEmail,
      password,
      role
    }

    saveRegisteredUser(newUser)

    const userObj = { id: newUser.id, name: newUser.name, email: newUser.email, role }
    const sessObj = { user: userObj, access_token: `token_${Date.now()}` }

    setUser(userObj)
    setSession(sessObj)
    saveActiveSession(sessObj)

    return { user: userObj }
  }

  const logout = async () => {
    setUser(null)
    setSession(null)
    saveActiveSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, language, setLanguage, switchRole, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
