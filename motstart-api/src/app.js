import cors from 'cors'
import express from 'express'
import { errorHandler } from './middleware/errorHandler.js'
import { checkoutRouter } from './routes/checkout.js'
import { coursePurchasesRouter } from './routes/coursePurchases.js'
import { creatorCoursesRouter } from './routes/creatorCourses.js'
import { healthRouter } from './routes/health.js'
import { jobsRouter } from './routes/jobs.js'
import { profilesRouter } from './routes/profiles.js'
import { progressRouter } from './routes/progress.js'

const app = express()

const configuredOrigins = (process.env.CLIENT_ORIGIN ?? 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

function isAllowedOrigin(origin) {
  if (!origin) return true
  if (configuredOrigins.includes(origin)) return true

  try {
    const url = new URL(origin)
    if (url.hostname.endsWith('.vercel.app')) return true

    const isDevHost =
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1' ||
      url.hostname.startsWith('192.168.')
    return isDevHost && ['3000', '3001'].includes(url.port)
  } catch {
    return false
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true)
        return
      }
      callback(new Error('Origem não permitida pelo CORS da API'))
    },
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))

app.get('/', (_req, res) => {
  res.json({
    name: 'MotStart API',
    docs: '/api/health',
    endpoints: [
      'GET  /api/health',
      'POST /api/checkout',
      'POST /api/course-purchases',
      'POST /api/profiles/register',
      'POST /api/profiles/login',
      'GET  /api/profiles/:email',
      'PUT  /api/profiles',
      'GET  /api/progress?email=',
      'PUT  /api/progress',
      'GET  /api/jobs',
      'POST /api/jobs',
      'DELETE /api/jobs/:id',
      'GET  /api/creator-courses?authorEmail=',
      'POST /api/creator-courses',
    ],
  })
})

app.use('/api/health', healthRouter)
app.use('/api/checkout', checkoutRouter)
app.use('/api/course-purchases', coursePurchasesRouter)
app.use('/api/profiles', profilesRouter)
app.use('/api/progress', progressRouter)
app.use('/api/jobs', jobsRouter)
app.use('/api/creator-courses', creatorCoursesRouter)

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: 'Rota não encontrada' })
})

app.use(errorHandler)

export default app
