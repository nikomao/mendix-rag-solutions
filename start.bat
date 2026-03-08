@echo off
setlocal

cd /d "%~dp0"

if not exist "node_modules" (
  echo [Mendix-RAG] Installing dependencies...
  call cmd /c npm install
  if errorlevel 1 (
    echo [Mendix-RAG] Failed to install dependencies.
    pause
    exit /b 1
  )
)

echo [Mendix-RAG] Starting Next.js dev server...
call cmd /c npm run dev

if errorlevel 1 (
  echo [Mendix-RAG] Dev server exited with an error.
  pause
  exit /b 1
)
