# INKLOOM AI - Launch Full Stack (Backend + Frontend)
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "           INKLOOM AI - Team ASTRA3" -ForegroundColor White
Write-Host " 'Every piece of content. One trusted brand standard.'" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

Write-Host "`n[1/2] Launching Spring Boot Backend in separate window..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-File", (Join-Path $root "start-backend.ps1")

Start-Sleep -Seconds 3

Write-Host "[2/2] Launching Vite Frontend in separate window..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-File", (Join-Path $root "start-frontend.ps1")

Write-Host "`nINKLOOM AI is launching!" -ForegroundColor Cyan
Write-Host "Frontend:  http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend:   http://localhost:8080/api/health" -ForegroundColor Yellow
Write-Host "Logins:" -ForegroundColor Gray
Write-Host "  Reviewer: reviewer@inkloom.ai / Reviewer@123" -ForegroundColor Gray
Write-Host "  Admin:    admin@inkloom.ai    / Admin@123" -ForegroundColor Gray
Write-Host "  Creator:  creator@inkloom.ai  / Creator@123" -ForegroundColor Gray
Write-Host "  Owner:    owner@inkloom.ai    / Owner@123" -ForegroundColor Gray
