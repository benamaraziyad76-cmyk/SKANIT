@echo off
TITLE ScanAppetit - REDEMARRAGE SANS PERTE
color 0B
echo.
echo ==========================================
echo    REDEMARRAGE SERVEUR (SANS PERTE)            
echo ==========================================
echo.

echo [1/3] Arret processus Node...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] Installation de react-easy-crop...
call npm install react-easy-crop --no-fund --no-audit

echo.
echo [3/3] Demarrage serveur...
echo.
echo ==============================================================
echo   Menu client  : http://localhost:3000/r/la-scampia/t/P1     
echo   Admin        : http://localhost:3000/admin/la-scampia       
echo   Super Admin  : http://localhost:3000/superadmin             
echo   Cuisine      : http://localhost:3000/kitchen/la-scampia     
echo ==============================================================
echo.
echo Attends "Ready" puis ouvre ton navigateur...
echo.
call npm run dev -- -p 3000
pause
