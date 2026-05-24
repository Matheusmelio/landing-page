import type { AuthUser } from '@/auth/types'
import type { EnterprisePlan } from '@/lib/enterprisePlan'
import { apiFetch, isApiEnabled } from '@/lib/api/http'
import { setActivePlanIdForUser } from '@/lib/userCourseProgress'

type ApiProfile = {
  email: string
  name: string
  role: AuthUser['role']
  companyName?: string | null
  enterprisePlan?: EnterprisePlan | null
  activePlanId?: string | null
}

function toAuthUser(p: ApiProfile): AuthUser {
  if (p.role === 'enterprise') {
    return {
      email: p.email,
      name: p.name,
      role: 'enterprise',
      companyName: p.companyName ?? undefined,
      enterprisePlan: p.enterprisePlan ?? undefined,
    }
  }
  return { email: p.email, name: p.name, role: 'student' }
}

export async function upsertProfile(user: AuthUser): Promise<void> {
  if (!isApiEnabled()) return

  await apiFetch('/api/profiles', {
    method: 'PUT',
    body: JSON.stringify({
      email: user.email,
      name: user.name,
      role: user.role,
      companyName: user.companyName,
      enterprisePlan: user.enterprisePlan,
    }),
  })
}

export async function fetchProfileByEmail(email: string): Promise<AuthUser | null> {
  if (!isApiEnabled()) return null

  try {
    const res = await apiFetch<{ ok: true; profile: ApiProfile }>(
      `/api/profiles/${encodeURIComponent(email)}`,
    )
    if (res.profile.activePlanId) {
      setActivePlanIdForUser(res.profile.email, res.profile.activePlanId)
    }
    return toAuthUser(res.profile)
  } catch {
    return null
  }
}
