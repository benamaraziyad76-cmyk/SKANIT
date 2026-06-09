@echo off
cd /d "%~dp0"
TITLE Reparation Rapide Skanit
color 0E
echo ===================================================
echo    REPARATION ET LANCEMENT RAPIDE DE SCANAPPETIT
echo ===================================================
echo.
echo [1/5] Fermeture des processus Node existants...
taskkill /F /IM node.exe >nul 2>&1
echo OK.
echo.
echo [2/5] Nettoyage du cache Next.js...
if exist ".next" rmdir /s /q ".next"
echo OK.
echo.
echo [3/5] Regeneration du client Prisma (CRUCIAL)...
call npx prisma generate
echo.
echo [4/5] Synchronisation et Remplissage de la base de donnees...
:: call npx prisma db push --accept-data-loss
:: call npx prisma db seed
echo OK.
echo.
echo [5/5] Demarrage du serveur...
echo ===================================================
echo Le site va s'ouvrir sur http://localhost:3000
echo ===================================================
echo.
start http://localhost:3000/login
npm run dev -- -p 3000
pause
