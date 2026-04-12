import { Link } from 'react-router-dom'
import { MainHeader } from '../components/MainHeader'

const PLACEHOLDERS = [
  {
    title: 'Desafios com IA',
    desc: 'Prompts guiados para revisar código e aprender boas práticas com feedback automático.',
  },
  {
    title: 'Quiz adaptativo',
    desc: 'Perguntas que ajustam dificuldade conforme seu desempenho nas trilhas.',
  },
  {
    title: 'Projetos práticos',
    desc: 'Entregas corrigidas com rubrica — em integração com os cursos da plataforma.',
  },
]

export function ExercisesPage() {
  return (
    <div className="page">
      <MainHeader />
      <div className="container section-wrap section-wrap--top">
        <header className="exercises-head">
          <h1 className="page-title">Exercícios IA</h1>
          <p className="page-lead">
            Prática guiada com inteligência artificial para fixar o que você estuda nos cursos. Em produção, esta área
            conectaria ao seu progresso e ao plano assinado.
          </p>
        </header>

        <div className="exercises-grid">
          {PLACEHOLDERS.map((p) => (
            <article key={p.title} className="exercises-card">
              <h2 className="exercises-card__title">{p.title}</h2>
              <p className="exercises-card__desc">{p.desc}</p>
              <span className="exercises-card__badge">Em breve</span>
            </article>
          ))}
        </div>

        <p className="exercises-foot">
          <Link to="/planos" className="link-purple">
            Ver planos com acesso completo
          </Link>
          {' · '}
          <Link to="/" className="link-purple">
            Voltar ao início
          </Link>
        </p>
      </div>
    </div>
  )
}
