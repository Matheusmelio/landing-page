import type { EnterprisePlan } from '../lib/enterprisePlan'

export type UserRole = 'student' | 'enterprise'

export type AuthUser = {
  email: string
  name: string
  role: UserRole
  companyName?: string
  enterprisePlan?: EnterprisePlan
}
