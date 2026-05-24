import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const base = 'http://localhost:3001'
const outDir = path.join(process.cwd(), 'validation-screenshots')
fs.mkdirSync(outDir, { recursive: true })

const demoUser = {
  name: 'Ana Carolina Silva',
  email: 'ana@demo.motstart',
  role: 'student',
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

async function shot(name, url) {
  const res = await page.goto(`${base}${url}`, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1500)
  const file = path.join(outDir, `${name}.png`)
  await page.screenshot({ path: file, fullPage: true })
  return { name, url, status: res?.status(), finalUrl: page.url(), file }
}

const results = []

results.push(await shot('home', '/'))

await page.goto(`${base}/`, { waitUntil: 'networkidle' })
await page.evaluate((user) => {
  localStorage.setItem('motstart_user_v1', JSON.stringify(user))
}, demoUser)

results.push(await shot('perfil-estudante', '/perfil'))

await page.click('#profile-tab-agenda')
await page.waitForTimeout(500)
const agendaFile = path.join(outDir, 'perfil-agenda.png')
await page.screenshot({ path: agendaFile, fullPage: true })
results.push({ name: 'perfil-agenda', url: '/perfil#agenda', file: agendaFile })

results.push(await shot('exercicios-ia', '/exercicios-ia'))
results.push(await shot('vagas', '/vagas'))
results.push(await shot('login', '/login'))

await browser.close()

const report = {
  validatedAt: new Date().toISOString(),
  base,
  results,
  tip: 'Abra http://localhost:3001 no navegador (servidor de produção com build limpo).',
}
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
