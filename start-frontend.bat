@echo off
title INKLOOM AI - Frontend Dev Server
echo [INKLOOM AI] Starting Frontend Dev Server on http://localhost:5173...
cd /d "%~dp0frontend"
npm run dev
pause
