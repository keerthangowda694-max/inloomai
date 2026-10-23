@echo off
title INKLOOM AI - Spring Boot Backend
echo [INKLOOM AI] Starting Spring Boot Backend on http://localhost:8080...
cd /d "%~dp0backend"
if not exist "target\inkloom-backend-1.0.0-SNAPSHOT.jar" (
    echo [INKLOOM AI] Jar not found, compiling with Maven...
    call mvn package -DskipTests
)
java -jar "target\inkloom-backend-1.0.0-SNAPSHOT.jar"
pause
