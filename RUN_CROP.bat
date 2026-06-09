@echo off
echo Installation de sharp (pour le rognage d'images)...
call npm install sharp --no-save

echo.
echo Lancement du rognage des images de menu...
call node CROP_MENU_IMAGES.js

echo.
echo Images rognees avec succes.
echo Lancez START_SKANIT.bat pour mettre a jour la base de donnees et demarrer !
pause
