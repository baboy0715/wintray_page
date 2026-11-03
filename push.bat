@echo off
chcp 65001 >nul
title WinterTray - Automatikus GitHub Push

cd /d "%~dp0"

echo ========================================================
echo        WinterTray Weboldal - Automatikus Push
echo ========================================================
echo.

:: 1. releases.json frissítése a helyi releases mappa alapján
echo [1/3] releases.json generálása...
node build.js
if %errorlevel% neq 0 (
    echo.
    echo [HIBA] A build.js futtatása sikertelen!
    pause
    exit /b %errorlevel%
)
echo.

:: 2. Változások hozzáadása és commit
echo [2/3] Fájlok hozzáadása és mentése...
git add .

set /p COMMIT_MSG="Adj meg egy commit uzenetet (Enter = automatikus): "
if "%COMMIT_MSG%"=="" (
    set COMMIT_MSG=Frissites - %date% %time:~0,5%
)

git commit -m "%COMMIT_MSG%"
echo.

:: 3. Push a GitHubra
echo [3/3] Feltoltes a GitHubra...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo      SIKERES FELTÖLTÉS A GITHUBRA!
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo      [HIBA] Nem sikerült a push a GitHubra!
    echo ========================================================
)

echo.
pause
