import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const base = 'http://localhost:3000'
const outDir = path.join(process.cwd(), 'validation-screenshots')
fs.mkdirSync(outDir, { recursive: true })

const routes = [
  { name: 'home', url: '/', wait: 2500 },
  { name: 'exercicios-ia', url: '/exercicios-ia', wait: 800 },
  { name: 'vagas', url: '/vagas', wait: 800 },
  { name: 'login', url: '/login', wait: 800 },
  { name: 'perfil', url: '/perfil', wait: 1200 },
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

const results = []

for (const r of routes) {
  const res = await page.goto(`${base}${r.url}`, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(r.wait)
  const file = path.join(outDir, `${r.name}.png`)
  await page.screenshot({ path: file, fullPage: true })
  const hasCss = await page.evaluate(() => {
    const sheets = [...document.styleSheets]
    return sheets.length > 0
  })
  const title = await page.title()
  const finalUrl = page.url()
  results.push({
    route: r.url,
    status: res?.status() ?? 0,
    finalUrl,
    title,
    hasCss,
    screenshot: file,
  })
}

await browser.close()

const report = { capturedAt: new Date().toISOString(), base, results }
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
