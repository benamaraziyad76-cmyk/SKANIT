@echo off
cd /d "%~dp0"
TITLE ScanAppetit - START SECURISE
color 0A
echo.
echo ==========================================
echo    SKANIT - DEMARRAGE SECURISE           
echo ==========================================
echo    (Donnees protegees - Pas de reset)
echo.

:: ── 1. KILL NODE ─────────────────────────────
echo [1/6] Arret processus Node...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

:: ── 2. PURGE CACHE ───────────────────────────
echo [2/6] Purge cache Next.js...
if exist ".next" rmdir /s /q ".next" >nul 2>&1
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache" >nul 2>&1
echo    Cache purge OK

:: ── 3. INSTALLATION DES DEPENDANCES ──────────────
echo [3/6] Verification et installation des dependances (Sharp, Cropper)...
call npm install sharp react-easy-crop --no-fund --no-audit >nul 2>&1
echo    Dependances pretes.

:: ── 4. ROGNER LES IMAGES (DESACTIVE POUR NE PAS ECRASER VOS PHOTOS) ──
echo [4/6] (Desactive) Rognage des images du menu...
if not exist "public\menu-images" mkdir "public\menu-images"
:: call node INTEGRER_MON_DEPOT.js

:: ── 5. RESET BDD + SEED ──────────────────────
echo [5/6] Verification base de donnees...
set DATABASE_URL=file:./dev.db
:: if exist "prisma\dev.db" del /f /q "prisma\dev.db"
:: if exist "prisma\dev.db-journal" del /f /q "prisma\dev.db-journal"
call npx prisma generate
:: call npx prisma db push --accept-data-loss
:: call npx prisma db seed
:: call npx tsx scripts/reparer_menu.ts

:: ── 6. START SERVEUR ─────────────────────────
echo.
echo [6/6] Demarrage serveur...
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
