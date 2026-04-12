export type Achievement = {
  id: string
  title: string
  description: string
  unlocked: boolean
  icon: string
}

export const DASHBOARD_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach1',
    title: 'Primeira aula',
    description: 'Concluiu sua primeira aula em qualquer curso.',
    unlocked: true,
    icon: '🎬',
  },
  {
    id: 'ach2',
    title: 'Sequência de 3 dias',
    description: 'Estudou três dias seguidos.',
    unlocked: true,
    icon: '🔥',
  },
  {
    id: 'ach3',
    title: 'Módulo completo',
    description: 'Finalizou um módulo inteiro com nota mínima de 80%.',
    unlocked: false,
    icon: '📚',
  },
  {
    id: 'ach4',
    title: 'Mão na massa',
    description: 'Enviou 5 exercícios com IA corrigidos.',
    unlocked: false,
    icon: '✨',
  },
  {
    id: 'ach5',
    title: 'Explorador',
    description: 'Matriculou-se em 3 áreas diferentes (ex.: web, dados, design).',
    unlocked: true,
    icon: '🧭',
  },
  {
    id: 'ach6',
    title: 'Comunidade',
    description: 'Participou de um fórum ou live da MotStart.',
    unlocked: false,
    icon: '💬',
  },
]
