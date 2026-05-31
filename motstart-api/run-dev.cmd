@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
echo.
echo MotStart API em http://localhost:4000
echo.
if not exist ".env" (
  echo AVISO: copie .env.example para .env e configure o Supabase.
  echo.
)
npm run dev
pause
