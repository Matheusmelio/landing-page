/**
 * - `standard`: empresa avulsa na plataforma (sem contrato B2B) — vagas + talentos.
 * - `contract`: legado — sem vitrine de vagas de terceiros; ainda pode usar busca de talentos.
 * - `contract_employee`: colaborador — sem vagas públicas, sem talentos, sem publicar vaga.
 * - `contract_manager`: gestor — vagas, talentos e publicação.
 */
export type EnterprisePlan = 'standard' | 'contract' | 'contract_employee' | 'contract_manager'

export function enterpriseBlocksPublicJobVitrine(plan?: EnterprisePlan): boolean {
  return plan === 'contract' || plan === 'contract_employee'
}

export function enterpriseCanUseTalentRecruitment(plan?: EnterprisePlan): boolean {
  return plan === 'standard' || plan === 'contract_manager' || plan === 'contract'
}

export function enterpriseIsB2BContract(plan?: EnterprisePlan): boolean {
  return plan === 'contract' || plan === 'contract_employee' || plan === 'contract_manager'
}

export function normalizeEnterprisePlan(pl: EnterprisePlan | undefined): EnterprisePlan {
  if (pl === 'contract' || pl === 'standard' || pl === 'contract_employee' || pl === 'contract_manager') return pl
  return 'standard'
}
