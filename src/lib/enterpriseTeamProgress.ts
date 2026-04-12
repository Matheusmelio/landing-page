/** Progresso agregado por colaborador — demonstração para conta empresarial com contrato B2B. */

export type ContractTeamMember = {
  id: string
  name: string
  role: string
  /** Média de conclusão no catálogo vinculado ao contrato (0–100). */
  progressPct: number
}

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h, 31) + s.charCodeAt(i)
  }
  return Math.abs(h)
}

const ROLES = [
  'Desenvolvimento',
  'Dados',
  'Infraestrutura',
  'Produto',
  'Design',
  'Segurança',
]

const FIRST = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elena', 'Felipe', 'Gabriela', 'Henrique', 'Isabela', 'João']

/**
 * Lista estável de colaboradores e percentuais (demo) a partir da empresa logada.
 */
export function getContractTeamProgressDemo(companyKey: string): ContractTeamMember[] {
  const seed = hashString(companyKey || 'motstart')
  const n = 4 + (seed % 3)
  const out: ContractTeamMember[] = []
  for (let i = 0; i < n; i++) {
    const h = hashString(`${companyKey}:${i}`)
    const first = FIRST[h % FIRST.length]
    const lastInitial = String.fromCharCode(65 + (h % 26))
    const pct = 22 + (h % 71)
    out.push({
      id: `team-${i}-${h}`,
      name: `${first} ${lastInitial}.`,
      role: ROLES[h % ROLES.length],
      progressPct: pct,
    })
  }
  return out.sort((a, b) => b.progressPct - a.progressPct)
}
