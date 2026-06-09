@echo off
TITLE Mise a jour ScanAppetit vers GitHub et Vercel
echo =========================================================
echo   ENVOI DES NOUVEAUTES 3D/AR VERS TON SITE
echo =========================================================
echo.

cd /d "C:\Users\Ziyad\Desktop\teste"

echo [1/2] Preparation des fichiers...
:: On essaye de trouver git.exe dans les chemins classiques si pas dans le PATH
set GIT_PATH="C:\Program Files\Git\bin\git.exe"
if not exist %GIT_PATH% set GIT_PATH="C:\Program Files (x86)\Git\bin\git.exe"
if not exist %GIT_PATH% set GIT_PATH="git.exe"
echo [1.5/2] Mise a jour de securite (Next.js)...
call npm install next@latest --legacy-peer-deps >nul 2>&1

echo [2/2] Configuration et Envoi vers GitHub...
%GIT_PATH% init
%GIT_PATH% config user.email "contact@skanit.com"
%GIT_PATH% config user.name "Ziyad"
%GIT_PATH% remote remove origin >nul 2>&1
%GIT_PATH% remote add origin https://github.com/benamaraziyad76-cmyk/SKANIT.git

:: Nettoyage des fichiers trop lourds (ZIP, photos brutes) de l'historique Git
%GIT_PATH% rm -r --cached "*.zip" >nul 2>&1
%GIT_PATH% rm -r --cached "DEPOSER_PHOTOS_MENU_ICI/" >nul 2>&1
%GIT_PATH% rm -r --cached "PHOTOS_NOUVELLES/" >nul 2>&1

%GIT_PATH% add .
%GIT_PATH% commit --amend -m "Déploiement complet : Authentification, Supabase, et Routes Sécurisées"
%GIT_PATH% branch -M main
%GIT_PATH% push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ---------------------------------------------------------
    echo   BRAVO ! Le code source a ete envoye sur SKANIT.git !
    echo   Vercel va automatiquement demarrer le deploiement.
    echo ---------------------------------------------------------
) else (
    echo.
    echo ---------------------------------------------------------
    echo   ERREUR : GitHub a demande un mot de passe ou Git n'est pas la.
    echo   Essaie plutot d'ouvrir l'application "Git Bash" manuellement.
    echo ---------------------------------------------------------
)

echo.
echo Appuie sur une touche pour fermer.
pause > nul
