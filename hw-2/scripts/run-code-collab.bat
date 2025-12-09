@echo off
REM CODE_COLLAB - One-Click Launcher for Windows
REM This script makes running CODE_COLLAB as easy as running an EXE

echo.
echo Starting CODE_COLLAB...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running.
    echo Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)

echo [OK] Docker is running
echo.

REM Check if image exists
docker image inspect code-collab:latest >nul 2>&1
if errorlevel 1 (
    echo Building CODE_COLLAB ^(first time only^)...
    echo This may take 2-3 minutes...
    echo.
    docker build -t code-collab:latest . || (
        echo [ERROR] Build failed. Please check the error messages above.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Build complete!
    echo.
)

REM Stop any existing container
docker stop code-collab >nul 2>&1
docker rm code-collab >nul 2>&1

REM Run the container
echo Launching CODE_COLLAB...
docker run -d --name code-collab -p 80:80 code-collab:latest >nul

REM Wait for startup
echo Waiting for services to start...
timeout /t 5 >nul

REM Health check
curl -s http://localhost >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Failed to start CODE_COLLAB
    echo Check Docker logs: docker logs code-collab
    pause
    exit /b 1
)

echo.
echo [OK] CODE_COLLAB is running!
echo.
echo Opening in your browser...
echo URL: http://localhost
echo.
echo To stop: docker stop code-collab
echo.

REM Open browser
start http://localhost
