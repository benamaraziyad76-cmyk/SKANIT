echo [1/3] Nettoyage du cache npm...
call npm cache clean --force
echo.
echo [2/3] Installation FORCEE de l'outil de rognage...
call npm install react-easy-crop sharp --save --legacy-peer-deps
echo.
echo [3/3] Verification...
if exist "node_modules\react-easy-crop" (
    echo ✅ Installation REUSSIE !
) else (
    echo ❌ ECHEC de l'installation. Verifie ta connexion internet.
)
echo.
echo ==========================================
echo    RELANCE START_SKANIT.bat MAINTENANT
echo ==========================================
pause

