import 'dotenv/config'
import app from './app.js'

const PORT = Number(process.env.PORT) || 4000

app.listen(PORT, () => {
  console.log(`MotStart API rodando em http://localhost:${PORT}`)
  console.log(`Health: http://localhost:${PORT}/api/health`)
})
