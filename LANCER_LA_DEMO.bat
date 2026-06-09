@echo off
cd /d "%~dp0"
TITLE Serveur ScanAppetit (Ne pas fermer)
color 0A
echo ===================================================
echo     LANCEMENT DU SERVEUR SCANAPPETIT
echo ===================================================
echo.
echo [1/4] Nettoyage des anciens processus...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo [2/4] Nettoyage du cache Next.js (pour eviter les bugs)...
if exist ".next" rmdir /s /q ".next"

echo.
:: call node INTEGRER_MON_DEPOT.js

echo.
echo [3/4] Verification de la base de donnees et reparation des images...
call npx prisma generate >nul 2>&1
:: call npx prisma db push --accept-data-loss >nul 2>&1
:: call npx tsx scripts/reparer_menu.ts

echo.
echo [4/4] DEMARRAGE DU SERVEUR SUR LE PORT 3000...
echo ===================================================
echo /!\ NE FERME PAS CETTE FENETRE NOIRE /!\
echo.
echo Une page web va s'ouvrir automatiquement dans 10 secondes.
echo Si elle affiche une erreur, rafraichis la page (F5).
echo ===================================================

:: Ouvre le navigateur après un petit délai en arrière-plan (ping sert de timer)
start cmd /c "ping localhost -n 12 >nul && start http://localhost:3000/login"

:: Lance Next.js sur le port 3000 explicitement
call npm run dev -- -p 3000

echo.
echo LE SERVEUR A CRASHE !
echo Copie le texte rouge au-dessus et envoie-le a l'assistant.
pause
