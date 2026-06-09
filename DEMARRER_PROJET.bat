@echo off
TITLE Nettoyage Radical ScanAppetit
echo ========================================================
echo    🚀 NETTOYAGE RADICAL ET RELANCE 🚀
echo ========================================================
echo.

echo [1/5] Arret de TOUS les processus Node...
taskkill /F /IM node.exe >nul 2>&1
echo OK.

echo [2/5] Suppression du verrou de base de donnees et du cache...
if exist "dev.db-journal" del "dev.db-journal"
if exist "dev.db" del "dev.db"
if exist ".next" rmdir /s /q ".next"
echo OK (Base de donnees et cache supprimes).

echo [3/5] Reinstallation rapide des dependances (au cas ou)...
call npm install --no-audit --no-fund
echo OK.

echo [4/5] Reconstruction de la base de donnees...
call npx prisma db push --accept-data-loss
call npx prisma db seed
echo OK (Base de donnees prete avec les plats).

echo [5/5] Lancement du serveur...
echo -------------------------------------------------------------
echo PATIENTE QUE LE TERMINAL AFFICHE "Ready"
echo PUIS OUVRE : http://localhost:3000/r/le-jardin/t/T1
echo -------------------------------------------------------------
echo.

npm run dev
pause
