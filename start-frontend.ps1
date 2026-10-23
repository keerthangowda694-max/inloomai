# INKLOOM AI - Start Frontend Service
Write-Host "Starting INKLOOM AI Frontend Dev Server on http://localhost:5173..." -ForegroundColor Magenta

$frontendDir = Join-Path $PSScriptRoot "frontend"
Set-Location $frontendDir

npm run dev
