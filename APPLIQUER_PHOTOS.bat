@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ==========================================
2: echo    APPLICATION DES PHOTOS INDIVIDUELLES
3: echo ==========================================
4: echo.
5: 
6: set SRC=DEPOSER_PHOTOS_MENU_ICI
7: set DEST=public\menu-images
8: 
9: if not exist "%SRC%" (
10:     echo [!] Dossier %SRC% introuvable.
11:     pause
12:     exit /b
13: )
14: 
15: if not exist "%DEST%" mkdir "%DEST%"
16: 
17: echo [1/2] Copie des nouvelles photos...
18: xcopy "%SRC%\*.jpg" "%DEST%\" /Y /S /Q >nul 2>&1
19: xcopy "%SRC%\*.png" "%DEST%\" /Y /S /Q >nul 2>&1
20: 
21: echo [2/2] Mise a jour du cache...
22: :: On touche un fichier pour forcer Next.js a voir les changements si besoin
23: echo %date% %time% > public\menu-images\last_update.txt
24: 
25: echo.
26: echo ✅ Termine ! Les photos ont ete transferees dans le dossier public.
27: echo Relancez la page du menu pour voir les changements.
28: echo.
29: pause
