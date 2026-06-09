/**
 * INTEGRER_PHOTOS.js — v3 FINAL
 * Découpe les photos depuis les planches dans PHOTOS_NOUVELLES
 * et les place dans public/menu-images/
 * 
 * Mapping basé sur l'analyse visuelle de chaque planche :
 * 
 * ┌─ burgers.jpg,.png (fond blanc, pas de UI Canva)
 * │   Grille 2×3, position bas-droite vide
 * │   L1=Le Double S  R1=Le Smoke
 * │   L2=Big Smash    R2=Le Crispy  
 * │   L3=Le Country   (vide)
 * │
 * ├─ naan.jpg.jpg (capture Canva avec barres UI)
 * │   Grille 2×3 dans la zone centrale
 * │   L1=Big Naan       R1=Cow Boy
 * │   L2=Crispy Chick'n R2=Chèvre Miel
 * │   L3=Le Smashé      R3=Boursin Naan
 * │
 * ├─ plats.jpg.jpg (image propre, fond clair)
 * │   Grille 2×3 avec labels texte
 * │   L1=Escalope Milanaise  R1=Steak à cheval
 * │   L2=Poulet normand      R2=Entrecôte
 * │   L3=Escalope gratinée   R3=Lasagne
 * │
 * └─ sandwiches.jpg.jpg (capture Canva avec barres UI)
 *     Grille 2×3 dans la zone centrale
 *     L1=Américain  R1=Chicken
 *     L2=Kebab      R2=Royal
 *     L3=Spécial    R3=Boursin
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC_DIR = path.join(__dirname, 'PHOTOS_NOUVELLES');
const DEST_DIR = path.join(__dirname, 'public', 'menu-images');

if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });

async function cropAndSave(srcPath, destFile, region) {
  try {
    const meta = await sharp(srcPath).metadata();
    const w = meta.width;
    const h = meta.height;
    
    let left   = Math.round(region.left   * w);
    let top    = Math.round(region.top    * h);
    let width  = Math.round(region.width  * w);
    let height = Math.round(region.height * h);
    
    // Clamp aux limites
    left = Math.max(0, Math.min(left, w - 1));
    top = Math.max(0, Math.min(top, h - 1));
    width = Math.min(width, w - left);
    height = Math.min(height, h - top);

    let image = sharp(srcPath).extract({ left, top, width, height });
    
    // Fond blanc pour les PNG
    const ext = srcPath.toLowerCase();
    if (ext.endsWith('.png') || ext.includes('.png')) {
      image = image.flatten({ background: '#ffffff' });
    }
    
    await image
      .resize(800, 800, { fit: 'cover' })
      .jpeg({ quality: 98 })
      .toFile(path.join(DEST_DIR, destFile));
      
    console.log('  ✅ ' + destFile);
  } catch (e) {
    console.error('  ❌ ' + destFile + ': ' + e.message);
  }
}

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   INTEGRATION PHOTOS MENU — La Scampia v3 FINAL        ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');

  // ══════════════════════════════════════════════════════════════════
  // 1. SMASH BURGERS — burgers.jpg,.png
  //    Image fond blanc SANS UI Canva — grille 2×3
  //    5 burgers visibles, case bas-droite vide
  //    Analyse visuelle :
  //      L1: Burger classique crudités+frites = Le Double S (double steaks, crudités)
  //      R1: Burger bacon+frites = Le Smoke (steak smashé, bacon)
  //      L2: Triple patty = Big Smash (3 steaks smashés)
  //      R2: Burger oignons frits = Le Crispy (viande smashée, oignon frits)
  //      L3: Burger galette pomme de terre = Le Country (2 steaks, galette pdt)
  // ══════════════════════════════════════════════════════════════════
  const burgerSrc = path.join(SRC_DIR, 'burgers.jpg,.png');
  if (fs.existsSync(burgerSrc)) {
    console.log('🍔 Smash Burgers (5 items)...');
    
    // Rangée 1 (0% → 32%)
    await cropAndSave(burgerSrc, 'smash-double-s.jpg', { left: 0.00, top: 0.00, width: 0.50, height: 0.32 });
    await cropAndSave(burgerSrc, 'smash-smoke.jpg',    { left: 0.50, top: 0.00, width: 0.50, height: 0.32 });
    
    // Rangée 2 (33% → 64%)
    await cropAndSave(burgerSrc, 'smash-big-smah.jpg', { left: 0.00, top: 0.33, width: 0.50, height: 0.32 });
    await cropAndSave(burgerSrc, 'smash-crispy.jpg',   { left: 0.50, top: 0.33, width: 0.50, height: 0.32 });
    
    // Rangée 3 (66% → 97%) — seulement gauche
    await cropAndSave(burgerSrc, 'smash-contry.jpg',   { left: 0.00, top: 0.66, width: 0.50, height: 0.32 });
    
    // Le S → pas de photo dédiée, on réutilise Le Double S (le plus proche visuellement)
    await cropAndSave(burgerSrc, 'smash-le-s.jpg',     { left: 0.00, top: 0.00, width: 0.50, height: 0.32 });
    
    console.log('');
  } else {
    console.log('⚠️  Fichier burgers.jpg,.png non trouvé dans PHOTOS_NOUVELLES/');
    console.log('');
  }

  // ══════════════════════════════════════════════════════════════════
  // 2. NAAN BURGERS — naan.jpg.jpg
  //    Capture Canva (barres UI en haut ~12% et bas ~12%)
  //    Zone utile : ~20% à ~83% de la hauteur
  //    Grille 2×3 dans cette zone
  //    L1=Big Naan (label visible), R1=Cow Boy (label visible)
  //    L2=Crispy Chick'n, R2=Chèvre Miel (avec pot de miel)
  //    L3=Le Smashé, R3=Boursin Naan (plus gros, viande foncée)
  // ══════════════════════════════════════════════════════════════════
  const naanBurgerSrc = path.join(SRC_DIR, 'naan.jpg.jpg');
  if (fs.existsSync(naanBurgerSrc)) {
    console.log('🧀 Naan Burgers (6 items)...');
    
    // Rangée 1 : Big Naan + Cow Boy (25% → 42%)
    await cropAndSave(naanBurgerSrc, 'naanburger-big-naan.jpg',     { left: 0.06, top: 0.25, width: 0.40, height: 0.15 });
    await cropAndSave(naanBurgerSrc, 'naanburger-cowboy.jpg',       { left: 0.54, top: 0.25, width: 0.40, height: 0.15 });
    
    // Rangée 2 : Crispy Chick'n + Chèvre Miel (46% → 60%)
    await cropAndSave(naanBurgerSrc, 'naanburger-crispy-chickn.jpg',{ left: 0.06, top: 0.46, width: 0.40, height: 0.15 });
    await cropAndSave(naanBurgerSrc, 'naanburger-chevre-miel.jpg',  { left: 0.54, top: 0.46, width: 0.40, height: 0.15 });
    
    // Rangée 3 : Le Smashé + Boursin Naan (65% → 80%)
    await cropAndSave(naanBurgerSrc, 'naanburger-le-smashe.jpg',    { left: 0.06, top: 0.65, width: 0.40, height: 0.15 });
    await cropAndSave(naanBurgerSrc, 'naanburger-boursin.jpg',      { left: 0.54, top: 0.65, width: 0.40, height: 0.15 });
    
    console.log('');
  } else {
    console.log('⚠️  Fichier naan.jpg.jpg non trouvé dans PHOTOS_NOUVELLES/');
    console.log('');
  }

  // ══════════════════════════════════════════════════════════════════
  // 3. PLATS CUISINÉS — plats.jpg.jpg
  //    Image propre sans UI Canva, fond quasi-blanc
  //    Grille 2×3 avec labels texte bleus sous chaque plat
  //    L1=Escalope milanaise, R1=Steak à cheval
  //    L2=Filet de poulet normand, R2=Entrecôte
  //    L3=Escalope gratinée, R3=Lasagne
  // ══════════════════════════════════════════════════════════════════
  const platSrc = path.join(SRC_DIR, 'plats.jpg.jpg');
  if (fs.existsSync(platSrc)) {
    console.log('🍽️  Plats Cuisinés (6 items)...');
    
    // Rangée 1 (3% → 30%)
    await cropAndSave(platSrc, 'plat-escalope-milanaise.jpg', { left: 0.02, top: 0.03, width: 0.46, height: 0.28 });
    await cropAndSave(platSrc, 'plat-steak-cheval.jpg',       { left: 0.52, top: 0.03, width: 0.46, height: 0.28 });
    
    // Rangée 2 (35% → 62%)
    await cropAndSave(platSrc, 'plat-poulet-normand.jpg',     { left: 0.02, top: 0.35, width: 0.46, height: 0.28 });
    await cropAndSave(platSrc, 'plat-entrecote.jpg',          { left: 0.52, top: 0.35, width: 0.46, height: 0.28 });
    
    // Rangée 3 (67% → 95%)
    await cropAndSave(platSrc, 'plat-escalope-gratinee.jpg',  { left: 0.02, top: 0.67, width: 0.46, height: 0.28 });
    await cropAndSave(platSrc, 'plat-lasagne.jpg',            { left: 0.52, top: 0.67, width: 0.46, height: 0.28 });
    
    console.log('');
  } else {
    console.log('⚠️  Fichier plats.jpg.jpg non trouvé dans PHOTOS_NOUVELLES/');
    console.log('');
  }

  // ══════════════════════════════════════════════════════════════════
  // 4. SANDWICHES — sandwiches.jpg.jpg
  //    Capture Canva (barres UI en haut ~12% et bas ~12%)
  //    Zone utile : ~20% à ~83% de la hauteur
  //    L1=Américain (label visible), R1=Chicken (label visible)
  //    L2=Kebab (label visible), R2=Royal
  //    L3=Spécial, R3=Boursin
  //    PAS de photo wrap → on réutilise les sandwiches les plus proches
  // ══════════════════════════════════════════════════════════════════
  const sandwichSrc = path.join(SRC_DIR, 'sandwiches.jpg.jpg');
  if (fs.existsSync(sandwichSrc)) {
    console.log('🥪 Sandwiches (6 + 3 wraps)...');
    
    // Rangée 1 : Américain + Chicken (27% → 42%)
    await cropAndSave(sandwichSrc, 'sandwich-americain.jpg', { left: 0.06, top: 0.27, width: 0.40, height: 0.13 });
    await cropAndSave(sandwichSrc, 'sandwich-chicken.jpg',   { left: 0.54, top: 0.27, width: 0.40, height: 0.13 });
    
    // Rangée 2 : Kebab + Royal (45% → 58%)
    await cropAndSave(sandwichSrc, 'sandwich-kebab.jpg',     { left: 0.06, top: 0.45, width: 0.40, height: 0.13 });
    await cropAndSave(sandwichSrc, 'sandwich-royal.jpg',     { left: 0.54, top: 0.45, width: 0.40, height: 0.13 });
    
    // Rangée 3 : Spécial + Boursin (60% → 73%)
    await cropAndSave(sandwichSrc, 'sandwich-special.jpg',   { left: 0.06, top: 0.60, width: 0.40, height: 0.13 });
    await cropAndSave(sandwichSrc, 'sandwich-boursin.jpg',   { left: 0.54, top: 0.60, width: 0.40, height: 0.13 });
    
    // Wraps — réutilise des photos sandwich similaires
    await cropAndSave(sandwichSrc, 'sandwich-wrap-1v.jpg',   { left: 0.06, top: 0.27, width: 0.40, height: 0.13 }); // style Américain
    await cropAndSave(sandwichSrc, 'sandwich-wrap-2v.jpg',   { left: 0.06, top: 0.45, width: 0.40, height: 0.13 }); // style Kebab
    await cropAndSave(sandwichSrc, 'sandwich-wrap-3v.jpg',   { left: 0.54, top: 0.45, width: 0.40, height: 0.13 }); // style Royal
    
    console.log('');
  } else {
    console.log('⚠️  Fichier sandwiches.jpg.jpg non trouvé dans PHOTOS_NOUVELLES/');
    console.log('');
  }

  // ══════════════════════════════════════════════════════════════════
  // RÉSUMÉ
  // ══════════════════════════════════════════════════════════════════
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  🚀 TERMINÉ ! Photos découpées → public/menu-images/   ║');
  console.log('║                                                         ║');
  console.log('║  Catégories traitées :                                  ║');
  console.log('║    🍔 Smash Burgers  (6 fichiers)                      ║');
  console.log('║    🧀 Naan Burgers   (6 fichiers)                      ║');
  console.log('║    🍽️  Plats Cuisinés (6 fichiers)                      ║');
  console.log('║    🥪 Sandwiches     (9 fichiers)                      ║');
  console.log('║                                                         ║');
  console.log('║  Lance DEMARRER_PROJET.bat pour voir le résultat !      ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');
}

main().catch(console.error);
