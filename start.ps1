$ErrorActionPreference = "Stop"

Set-Location -Path $PSScriptRoot

if (-not (Test-Path "node_modules")) {
    Write-Host "[Mendix-RAG] Installing dependencies..."
    cmd /c npm install
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to install dependencies."
    }
}

Write-Host "[Mendix-RAG] Starting Next.js dev server..."
cmd /c npm run dev

if ($LASTEXITCODE -ne 0) {
    throw "Dev server exited with an error."
}
