import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type UserRole = 'student' | 'enterprise'

/** Empresa avulsa na plataforma vs empresa em contrato B2B MotStart (regras de vitrine e talentos). */
export type EnterprisePlan = 'standard' | 'contract'

export type AuthUser = {
  email: string
  name: string
  role: UserRole
  /** Preenchido quando role === 'enterprise' */
  companyName?: string
  /** Só `enterprise`: `contract` = sem vitrine de vagas de terceiros; colaboradores não entram na busca pública de talentos. */
  enterprisePlan?: EnterprisePlan
}

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
    enterprisePlan: p.enterprisePlan === 'contract' ? 'contract' : 'standard',
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
  /** Empresa em contrato B2B: sem vitrine de vagas de outras empresas; talentos do contrato fora da busca pública. */
  isContractEnterprise: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readUser())

  const login = useCallback((payload: AuthUser) => {
    const next = normalizeStoredUser({
      ...payload,
      companyName: payload.role === 'enterprise' ? payload.companyName || payload.name : undefined,
      enterprisePlan:
        payload.role === 'enterprise' ? (payload.enterprisePlan === 'contract' ? 'contract' : 'standard') : undefined,
    })
    setUser(next)
    writeUser(next)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    writeUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isEnterprise: user?.role === 'enterprise',
      isStudent: user?.role === 'student',
      isContractEnterprise: user?.role === 'enterprise' && user.enterprisePlan === 'contract',
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
