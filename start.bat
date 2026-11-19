@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Не найден Node.js 18+. Установите Node.js, затем запустите этот файл снова.
  echo 未找到 Node.js 18+。请安装 Node.js 后再次运行此文件。
  pause
  exit /b 1
)
start "Разговорная практика — сервер" cmd /k node server.js
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4173/?lesson=lesson1"
