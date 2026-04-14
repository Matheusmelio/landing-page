import { Routes, Route } from 'react-router-dom'
import './motstart.css'
import { RequireEnterprise } from './components/RequireEnterprise'
import { AppShell } from './layouts/AppShell'
import { CheckoutPage } from './pages/CheckoutPage'
import { CoursePlayerPage } from './pages/CoursePlayerPage'
import { CoursePurchasePage } from './pages/CoursePurchasePage'
import { CoursesPage } from './pages/CoursesPage'
import { EnterpriseJobsPage } from './pages/EnterpriseJobsPage'
import { EnterpriseSupportPage } from './pages/EnterpriseSupportPage'
import { ExercisesPage } from './pages/ExercisesPage'
import { AboutPage } from './pages/AboutPage'
import { CreatorCourseEditorPage } from './pages/CreatorCourseEditorPage'
import { CreatorPublishPage } from './pages/CreatorPublishPage'
import { HomePage } from './pages/HomePage'
import { JobsBrowsePage } from './pages/JobsBrowsePage'
import { LegalPage } from './pages/LegalPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PlansPage } from './pages/PlansPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'
import { TalentsPage } from './pages/TalentsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/publicar-curso/:courseId/editar" element={<CreatorCourseEditorPage />} />
        <Route path="/publicar-curso" element={<CreatorPublishPage />} />
        <Route path="/cursos" element={<CoursesPage />} />
        <Route path="/curso/:courseId/comprar" element={<CoursePurchasePage />} />
        <Route path="/curso/:courseId" element={<CoursePlayerPage />} />
        <Route path="/planos" element={<PlansPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/vagas" element={<JobsBrowsePage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/talentos" element={<TalentsPage />} />
        <Route path="/exercicios-ia" element={<ExercisesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/termos" element={<LegalPage />} />
        <Route path="/empresa/assessoria" element={<EnterpriseSupportPage />} />
        <Route
          path="/empresa/vagas"
          element={
            <RequireEnterprise>
              <EnterpriseJobsPage />
            </RequireEnterprise>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
