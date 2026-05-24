const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '')

export function isApiEnabled(): boolean {
  return baseUrl.length > 0
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL não configurada')
  }

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  const body = (await res.json().catch(() => ({}))) as T & { error?: string }

  if (!res.ok) {
    throw new Error(
      typeof body === 'object' && body && 'error' in body && body.error
        ? String(body.error)
        : `Erro HTTP ${res.status}`,
    )
  }

  return body
}
