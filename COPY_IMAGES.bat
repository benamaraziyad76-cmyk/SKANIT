@echo off
REM Copie des images générées vers public/menu-images
if not exist "public\menu-images" mkdir "public\menu-images"

REM Images découpées (générées par IA)
copy /Y "C:\Users\Ziyad\.gemini\antigravity\brain\92a68695-a6b7-4dc0-9155-51392100be7e\sandwich_americain_1776560546565.png"  "public\menu-images\sandwich-americain.png"
copy /Y "C:\Users\Ziyad\.gemini\antigravity\brain\92a68695-a6b7-4dc0-9155-51392100be7e\sandwich_chicken_1776560665862.png"    "public\menu-images\sandwich-chicken.png"
copy /Y "C:\Users\Ziyad\.gemini\antigravity\brain\92a68695-a6b7-4dc0-9155-51392100be7e\sandwich_kebab_1776560742761.png"      "public\menu-images\sandwich-kebab.png"
copy /Y "C:\Users\Ziyad\.gemini\antigravity\brain\92a68695-a6b7-4dc0-9155-51392100be7e\sandwich_royal_1776560772455.png"      "public\menu-images\sandwich-royal.png"
copy /Y "C:\Users\Ziyad\.gemini\antigravity\brain\92a68695-a6b7-4dc0-9155-51392100be7e\sandwich_special_1776560807389.png"    "public\menu-images\sandwich-special.png"
copy /Y "C:\Users\Ziyad\.gemini\antigravity\brain\92a68695-a6b7-4dc0-9155-51392100be7e\smash_double_s_1776560679832.png"      "public\menu-images\smash-double-s.png"

REM Photos de menu complètes (fallback pour les items sans image découpée)
copy /Y "PHOTOS_MENU_A_REMPLIR\la scampia\IMG-20260418-WA0117(1).jpg" "public\menu-images\naan-burger-menu.jpg"
copy /Y "PHOTOS_MENU_A_REMPLIR\la scampia\IMG-20260418-WA0118.jpg"    "public\menu-images\cheese-naan-menu.jpg"
copy /Y "PHOTOS_MENU_A_REMPLIR\la scampia\IMG-20260418-WA0119.jpg"    "public\menu-images\smash-burger-menu.jpg"
copy /Y "PHOTOS_MENU_A_REMPLIR\la scampia\IMG-20260418-WA0120.jpg"    "public\menu-images\sandwich-menu.jpg"
copy /Y "PHOTOS_MENU_A_REMPLIR\la scampia\IMG-20260418-WA0121.jpg"    "public\menu-images\plats-menu.jpg"

echo Images copiees avec succes !
