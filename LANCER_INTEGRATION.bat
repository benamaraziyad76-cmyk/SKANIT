@echo off
title Integration Photos - La Scampia
cd /d "%~dp0"
echo Preparation du decoupage...
powershell -ExecutionPolicy Bypass -File "INTEGRER_PHOTOS.ps1"
echo.
echo Termine !
pause
