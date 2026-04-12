# Envia o projeto MotStart para https://github.com/Matheusmelio/landing-page
# Pré-requisitos: Git instalado (https://git-scm.com/download/win)
# Uso: na pasta motstart, execute:  powershell -ExecutionPolicy Bypass -File .\scripts\push-landing-page.ps1
#
# Opcional — criar o repositório vazio na API (evita criar manual no site):
#   $env:GITHUB_TOKEN = "seu_token_fine_grained"   # NUNCA commite o token
#   powershell -ExecutionPolicy Bypass -File .\scripts\push-landing-page.ps1

$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "Git nao encontrado no PATH. Instale: https://git-scm.com/download/win" -ForegroundColor Red
  exit 1
}

git config user.name "Matheusmelio"
git config user.email "mathmelio77@gmail.com"

if (-not (Test-Path .git)) {
  git init -b main
}

git add -A
$status = git status --porcelain
if (-not $status) {
  Write-Host "Nada novo para commitar." -ForegroundColor Yellow
} else {
  git commit -m "chore: commit inicial da landing page MotStart"
}

# Criar repositório na API (se token estiver definido)
$token = $env:GITHUB_TOKEN
if ($token) {
  $headers = @{
    Authorization = "Bearer $token"
    Accept        = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
  }
  $body = @{ name = "landing-page"; description = "MotStart — landing page (Vite + React)"; private = $false; auto_init = $false } | ConvertTo-Json
  try {
    Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json" | Out-Null
    Write-Host "Repositorio 'landing-page' criado (ou ja existia na conta)." -ForegroundColor Green
  } catch {
    if ($_.Exception.Response.StatusCode -eq 422) {
      Write-Host "Repositorio pode ja existir — continuando com push." -ForegroundColor Yellow
    } else {
      throw
    }
  }
} else {
  Write-Host "Dica: crie o repositorio vazio em https://github.com/new (nome: landing-page, sem README) ou defina GITHUB_TOKEN para criar via API." -ForegroundColor Cyan
}

git remote remove origin 2>$null
git remote add origin "https://github.com/Matheusmelio/landing-page.git"

Write-Host "Enviando para origin main..." -ForegroundColor Cyan
git push -u origin main
Write-Host "Concluido." -ForegroundColor Green
