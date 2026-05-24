@echo off
REM Garante Node/npm no PATH (ajuste se o Node estiver em outro lugar)
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
echo.
echo Iniciando MotStart em http://localhost:3000
echo Pressione Ctrl+C para parar.
echo.
npm run dev
pause
