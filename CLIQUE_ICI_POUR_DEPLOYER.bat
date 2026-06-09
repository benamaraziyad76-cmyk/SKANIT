@echo off
TITLE Deploiement ScanAppetit vers Vercel
echo =========================================================
echo   PLATEFORME SCANAPPETIT - DEPLOIEMENT VERCEL
echo =========================================================
echo.

cd /d "C:\Users\Ziyad\Desktop\teste"

echo [1/2] Verification de la connexion Vercel...
echo S'il n'y a pas de connexion, une page web s'ouvrira.
echo.
call npx vercel login
if %errorlevel% neq 0 (
    echo.
    echo ATTENTION : La connexion Vercel a echoue.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Envoi des mises a jour (3D/AR)...
echo Merci de patienter un instant...
echo.
call npx vercel --prod --confirm --yes

if %errorlevel% equ 0 (
    echo.
    echo ---------------------------------------------------------
    echo   BRAVO ! Le deploiement est un succes.
    echo   Toutes les nouveautes 3D/AR sont en ligne.
    echo ---------------------------------------------------------
) else (
    echo.
    echo ---------------------------------------------------------
    echo   ERREUR pendant le deploiement.
    echo   Regarde bien le message juste au-dessus.
    echo ---------------------------------------------------------
)

echo.
echo Appuie sur n'importe quelle touche pour fermer cette fenetre.
pause > nul
