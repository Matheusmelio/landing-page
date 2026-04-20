import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { AuthUser } from './types'
import {
  enterpriseBlocksPublicJobVitrine,
  enterpriseCanUseTalentRecruitment,
  enterpriseIsB2BContract,
  normalizeEnterprisePlan,
} from '../lib/enterprisePlan'

const STORAGE_KEY = 'motstart_user_v1'

function normalizeStoredUser(p: AuthUser): AuthUser {
  if (p.role === 'student') {
    return { email: p.email, name: p.name, role: 'student' }
  }
  return {
    email: p.email,
    name: p.name,
    role: 'enterprise',
    companyName: p.companyName || p.name,
    enterprisePlan: normalizeEnterprisePlan(p.enterprisePlan),
  }
}

function readUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as AuthUser
    if (!p?.email || !p?.role) return null
    return normalizeStoredUser(p)
  } catch {
    return null
  }
}

function writeUser(u: AuthUser | null) {
  if (!u) localStorage.removeItem(STORAGE_KEY)
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
}

type AuthContextValue = {
  user: AuthUser | null
  login: (payload: AuthUser) => void
  logout: () => void
  isEnterprise: boolean
  isStudent: boolean
  isContractEnterprise: boolean
  canEnterpriseRecruit: boolean
  isB2BEnterprise: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readUser())

  const login = useCallback((payload: AuthUser) => {
    const next = normalizeStoredUser({
      ...payload,
      companyName: payload.role === 'enterprise' ? payload.companyName || payload.name : undefined,
      enterprisePlan:
        payload.role === 'enterprise' ? normalizeEnterprisePlan(payload.enterprisePlan) : undefined,
    })
    setUser(next)
    writeUser(next)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    writeUser(null)
  }, [])

  const value = useMemo(() => {
    const ent = user?.role === 'enterprise' ? user.enterprisePlan : undefined
    return {
      user,
      login,
      logout,
      isEnterprise: user?.role === 'enterprise',
      isStudent: user?.role === 'student',
      isContractEnterprise: user?.role === 'enterprise' && enterpriseBlocksPublicJobVitrine(ent),
      canEnterpriseRecruit: user?.role === 'enterprise' && enterpriseCanUseTalentRecruitment(ent),
      isB2BEnterprise: user?.role === 'enterprise' && enterpriseIsB2BContract(ent),
    }
  }, [user, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook pareado com AuthProvider
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
