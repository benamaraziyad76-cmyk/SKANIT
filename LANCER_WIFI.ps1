# ScanAppetit - Lancement Serveur WiFi Local
# Ce script lance le serveur sur 0.0.0.0 pour accès depuis le réseau WiFi

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   🍽️  SCANAPPETIT — LANCEMENT SERVEUR WiFi" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Get local IP
$LocalIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -ne "127.0.0.1" } | Select-Object -First 1).IPAddress

if (-not $LocalIP) {
    $LocalIP = "192.168.x.x"
    Write-Host "⚠️  Impossible de détecter l'IP. Vérifiez manuellement." -ForegroundColor Red
}

Write-Host "✅ IP WiFi locale détectée : $LocalIP" -ForegroundColor Green
Write-Host ""
Write-Host "📱 LIENS D'ACCÈS DEPUIS LE RÉSEAU WIFI :" -ForegroundColor White
Write-Host ""
Write-Host "   🏠 Portail Principal :" -ForegroundColor Gray
Write-Host "   http://${LocalIP}:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "   🍽️  Menu Client (Table 1) :" -ForegroundColor Gray  
Write-Host "   http://${LocalIP}:3000/r/le-jardin/t/T1" -ForegroundColor Cyan
Write-Host ""
Write-Host "   📊 Panneau Admin :" -ForegroundColor Gray
Write-Host "   http://${LocalIP}:3000/admin" -ForegroundColor Yellow
Write-Host "   Mot de passe : admin123" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "   👨‍🍳 Cuisine :" -ForegroundColor Gray
Write-Host "   http://${LocalIP}:3000/kitchen" -ForegroundColor Magenta
Write-Host "   Mot de passe : kitchen123" -ForegroundColor DarkMagenta
Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Serveur en cours de démarrage..." -ForegroundColor White
Write-Host "  Appuyez CTRL+C pour arrêter" -ForegroundColor Gray
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Change to the project directory
Set-Location $PSScriptRoot

# Start Next.js dev server on all interfaces
$env:NODE_ENV = "development"
& npx next dev --hostname 0.0.0.0 --port 3000
