# INKLOOM AI - Start Backend Service
Write-Host "Starting INKLOOM AI Spring Boot Backend on http://localhost:8080..." -ForegroundColor Cyan

$backendDir = Join-Path $PSScriptRoot "backend"
$jarPath = Join-Path $backendDir "target\inkloom-backend-1.0.0-SNAPSHOT.jar"

if (-not (Test-Path $jarPath)) {
    Write-Host "Jar not found. Building with Maven..." -ForegroundColor Yellow
    Set-Location $backendDir
    & "mvn" package -DskipTests
}

Set-Location $backendDir
java -jar $jarPath
