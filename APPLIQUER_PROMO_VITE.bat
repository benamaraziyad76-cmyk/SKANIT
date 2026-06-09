@echo off
TITLE Mise a jour Skanit - Promo
echo ==========================================
echo    MISE A JOUR STRUCTURE + PROMO
echo ==========================================
echo.
echo [1/2] Mise a jour de la base de donnees...
call npx prisma db push
echo.
echo [2/3] Creation de la categorie Nouveautes...
call npx tsx scripts/add_nouveautes.ts
echo.
echo [3/3] Fusion des Smash Burgers et Tacos...
call npx tsx scripts/merge_variants.ts
call npx tsx scripts/update_coords.ts
echo.
echo ==========================================
echo    MENU ET COORDONNEES MIS A JOUR !
echo ==========================================
pause
