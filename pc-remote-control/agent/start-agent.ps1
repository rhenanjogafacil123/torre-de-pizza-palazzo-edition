$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
  Write-Host "Python nao encontrado. Instale Python 3.11+ e marque 'Add Python to PATH'." -ForegroundColor Red
  exit 1
}

if (-not (Test-Path ".venv")) { python -m venv .venv }
& .\.venv\Scripts\python.exe -m pip install --upgrade pip
& .\.venv\Scripts\pip.exe install -r requirements.txt

$tokenFile = Join-Path $PSScriptRoot ".remote-token"
if (-not (Test-Path $tokenFile)) {
  $bytes = New-Object byte[] 32
  [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
  $token = [Convert]::ToBase64String($bytes).Replace('+','-').Replace('/','_').TrimEnd('=')
  Set-Content -Path $tokenFile -Value $token -NoNewline
} else { $token = (Get-Content $tokenFile -Raw).Trim() }

$env:REMOTE_CONTROL_TOKEN = $token
Write-Host "`nTOKEN PESSOAL (guarde para usar no celular):" -ForegroundColor Cyan
Write-Host $token -ForegroundColor Yellow
Write-Host "`nIniciando agente em 127.0.0.1:8765..." -ForegroundColor Green
& .\.venv\Scripts\python.exe agent.py
