@echo off
echo ========================================================
echo    🚀 NETTOYAGE ET DEMARRAGE DE SCANAPPETIT  🚀
echo ========================================================
echo.
echo [1/4] Fermeture des anciens serveurs en arriere-plan...
taskkill /F /IM node.exe >nul 2>&1
echo OK !
echo.

echo [2/4] Suppression du cache memoire corrompu (Le probleme du chargement infini)...
if exist ".next" rmdir /s /q ".next"
echo OK ! Le cache est entierement vide.
echo.

echo [3/4] Verification de la base de donnees (Prisma)...
call npx prisma generate
echo OK !
echo.

echo [4/4] Lancement du nouveau serveur Next.js...
echo -------------------------------------------------------------
echo PATIENTE AU MOINS 1 A 2 MINUTES LORS DU PREMIER CHARGEMENT.
echo Next.js doit tout recalculer apres ce gros nettoyage.
echo.
echo Lien Magique: http://localhost:3000/r/le-jardin/t/table-1
echo -------------------------------------------------------------
echo.
set NODE_ENV=development

npx next dev --hostname 0.0.0.0 --port 3000
