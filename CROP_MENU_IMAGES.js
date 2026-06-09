/**
 * CROP_MENU_IMAGES.js — v2
 * Extrait chaque produit individuellement depuis les photos de menu La Scampia.
 * Coordonnées recalées précisément sur chaque photo.
 * Run: node CROP_MENU_IMAGES.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC = path.join(__dirname, 'PHOTOS_MENU_A_REMPLIR', 'la scampia');
const DEST = path.join(__dirname, 'public', 'menu-images');

if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true });

async function crop(srcFile, destFile, region) {
  try {
    const meta = await sharp(srcFile).metadata();
    const w = meta.width;
    const h = meta.height;
    const left   = Math.round(region.left   * w);
    const top    = Math.round(region.top    * h);
    const width  = Math.round(region.width  * w);
    const height = Math.round(region.height * h);
    // Clamp to image bounds
    const cLeft = Math.max(0, Math.min(left, w - 1));
    const cTop = Math.max(0, Math.min(top, h - 1));
    const cWidth = Math.min(width, w - cLeft);
    const cHeight = Math.min(height, h - cTop);
    await sharp(srcFile)
      .extract({ left: cLeft, top: cTop, width: cWidth, height: cHeight })
      .resize(600, 600, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 90 })
      .toFile(path.join(DEST, destFile));
    console.log(`  ✅ ${destFile}`);
  } catch (e) {
    console.error(`  ❌ ${destFile}: ${e.message}`);
  }
}

async function main() {
  console.log('\n=== Rognage des images menu La Scampia v2 ===\n');

  // ══════════════════════════════════════════════════════════════════════════
  // SANDWICH (IMG-20260418-WA0120.jpg)
  // Layout: 3 rangées de 2 + 1 rangée de 3 wraps en bas
  // ══════════════════════════════════════════════════════════════════════════
  const sw = path.join(SRC, 'IMG-20260418-WA0120.jpg');
  console.log('📁 Sandwich...');
  
  // Rangée 1 : Américain (gauche) + Chicken (droite)
  await crop(sw, 'sandwich-americain.jpg',  { left: 0.02, top: 0.10, width: 0.46, height: 0.22 });
  await crop(sw, 'sandwich-chicken.jpg',    { left: 0.52, top: 0.10, width: 0.46, height: 0.22 });
  
  // Rangée 2 : Kebab (gauche) + Royal (droite)
  await crop(sw, 'sandwich-kebab.jpg',      { left: 0.02, top: 0.33, width: 0.46, height: 0.22 });
  await crop(sw, 'sandwich-royal.jpg',      { left: 0.52, top: 0.33, width: 0.46, height: 0.22 });
  
  // Rangée 3 : Spécial (gauche) + Boursin (droite)
  await crop(sw, 'sandwich-special.jpg',    { left: 0.02, top: 0.55, width: 0.46, height: 0.22 });
  await crop(sw, 'sandwich-boursin.jpg',    { left: 0.52, top: 0.55, width: 0.46, height: 0.22 });
  
  // Rangée 4 : Wraps (3 colonnes)
  await crop(sw, 'sandwich-wrap-1v.jpg',    { left: 0.02, top: 0.80, width: 0.30, height: 0.18 });
  await crop(sw, 'sandwich-wrap-2v.jpg',    { left: 0.35, top: 0.80, width: 0.30, height: 0.18 });
  await crop(sw, 'sandwich-wrap-3v.jpg',    { left: 0.67, top: 0.80, width: 0.30, height: 0.18 });

  // ══════════════════════════════════════════════════════════════════════════
  // SMASH BURGER (IMG-20260418-WA0119.jpg)
  // Layout: 1 grande photo centrale (Le Double S), le reste en texte
  // On utilise la même photo pour tous les smash burgers
  // ══════════════════════════════════════════════════════════════════════════
  const smash = path.join(SRC, 'IMG-20260418-WA0119.jpg');
  console.log('\n📁 Smash Burger...');
  await crop(smash, 'smash-double-s.jpg',  { left: 0.08, top: 0.10, width: 0.84, height: 0.42 });
  // Les autres n'ont pas de photo individuelle → on prend le Double S
  await crop(smash, 'smash-le-s.jpg',      { left: 0.08, top: 0.10, width: 0.84, height: 0.42 });
  await crop(smash, 'smash-crispy.jpg',    { left: 0.08, top: 0.10, width: 0.84, height: 0.42 });
  await crop(smash, 'smash-smoke.jpg',     { left: 0.08, top: 0.10, width: 0.84, height: 0.42 });
  await crop(smash, 'smash-big-smah.jpg',  { left: 0.08, top: 0.10, width: 0.84, height: 0.42 });
  await crop(smash, 'smash-contry.jpg',    { left: 0.08, top: 0.10, width: 0.84, height: 0.42 });

  // ══════════════════════════════════════════════════════════════════════════
  // CHEESE NAAN (IMG-20260418-WA0118.jpg)
  // Layout: 6 photos (3 rangées x 2) + texte à droite pour les autres
  // ══════════════════════════════════════════════════════════════════════════
  const naan = path.join(SRC, 'IMG-20260418-WA0118.jpg');
  console.log('\n📁 Cheese Naan...');
  
  // Rangée 1 : Radical (gauche) + Royal (droite)
  await crop(naan, 'naan-radical.jpg',     { left: 0.02, top: 0.06, width: 0.46, height: 0.22 });
  await crop(naan, 'naan-royal.jpg',       { left: 0.52, top: 0.06, width: 0.46, height: 0.22 });
  
  // Rangée 2 : Boursin (gauche) + Tenders (droite)
  await crop(naan, 'naan-boursin.jpg',     { left: 0.02, top: 0.30, width: 0.46, height: 0.22 });
  await crop(naan, 'naan-tenders.jpg',     { left: 0.52, top: 0.30, width: 0.46, height: 0.22 });
  
  // Rangée 3 gauche : Steak (haut) + Kebab (bas)
  await crop(naan, 'naan-steak.jpg',       { left: 0.02, top: 0.54, width: 0.40, height: 0.20 });
  await crop(naan, 'naan-kebab.jpg',       { left: 0.02, top: 0.73, width: 0.40, height: 0.20 });
  
  // Naan texte uniquement → réutiliser la meilleure photo proche
  await crop(naan, 'naan-tandori.jpg',     { left: 0.52, top: 0.06, width: 0.46, height: 0.22 }); // Royal (viande)
  await crop(naan, 'naan-poulet-curry.jpg',{ left: 0.52, top: 0.30, width: 0.46, height: 0.22 }); // Tenders (poulet)
  await crop(naan, 'naan-chicken.jpg',     { left: 0.52, top: 0.06, width: 0.46, height: 0.22 }); // Royal
  await crop(naan, 'naan-veggie.jpg',      { left: 0.52, top: 0.30, width: 0.46, height: 0.22 }); // Tenders
  await crop(naan, 'naan-special.jpg',     { left: 0.02, top: 0.06, width: 0.46, height: 0.22 }); // Radical
  await crop(naan, 'naan-montagnard.jpg',  { left: 0.02, top: 0.30, width: 0.46, height: 0.22 }); // Boursin
  await crop(naan, 'naan-phenomene.jpg',   { left: 0.02, top: 0.54, width: 0.40, height: 0.20 }); // Steak

  // ══════════════════════════════════════════════════════════════════════════
  // NAAN BURGER (IMG-20260418-WA0117(1).jpg)
  // Layout: 6 produits en 3 rangées de 2
  // ══════════════════════════════════════════════════════════════════════════
  const nb = path.join(SRC, 'IMG-20260418-WA0117(1).jpg');
  console.log('\n📁 Naan Burger...');
  
  // Rangée 1 : Big Naan (gauche) + Cow Boy (droite)
  await crop(nb, 'naanburger-big-naan.jpg',      { left: 0.02, top: 0.08, width: 0.46, height: 0.28 });
  await crop(nb, 'naanburger-cowboy.jpg',         { left: 0.52, top: 0.08, width: 0.46, height: 0.28 });
  
  // Rangée 2 : Crispy Chick'n (gauche) + Chèvre Miel (droite)
  await crop(nb, 'naanburger-crispy-chickn.jpg',  { left: 0.02, top: 0.38, width: 0.46, height: 0.28 });
  await crop(nb, 'naanburger-chevre-miel.jpg',    { left: 0.52, top: 0.38, width: 0.46, height: 0.28 });
  
  // Rangée 3 : Le smashé (gauche) + Boursin (droite)
  await crop(nb, 'naanburger-le-smashe.jpg',      { left: 0.02, top: 0.68, width: 0.46, height: 0.28 });
  await crop(nb, 'naanburger-boursin.jpg',         { left: 0.52, top: 0.68, width: 0.46, height: 0.28 });

  // ══════════════════════════════════════════════════════════════════════════
  // PLATS CUISINÉS (IMG-20260418-WA0121.jpg)
  // Layout: 6 produits en 3 rangées de 2
  // ══════════════════════════════════════════════════════════════════════════
  const pl = path.join(SRC, 'IMG-20260418-WA0121.jpg');
  console.log('\n📁 Plats Cuisinés...');
  
  // Rangée 1 : Escalope milanaise (gauche) + Steak à cheval (droite)
  await crop(pl, 'plat-escalope-milanaise.jpg',  { left: 0.02, top: 0.06, width: 0.46, height: 0.25 });
  await crop(pl, 'plat-steak-cheval.jpg',        { left: 0.52, top: 0.06, width: 0.46, height: 0.25 });
  
  // Rangée 2 : Filet de poulet normand (gauche) + Entrecôte (droite)
  await crop(pl, 'plat-poulet-normand.jpg',      { left: 0.02, top: 0.33, width: 0.46, height: 0.25 });
  await crop(pl, 'plat-entrecote.jpg',           { left: 0.52, top: 0.33, width: 0.46, height: 0.25 });
  
  // Rangée 3 : Escalope gratinée (gauche) + Lasagne (droite)
  await crop(pl, 'plat-escalope-gratinee.jpg',   { left: 0.02, top: 0.60, width: 0.46, height: 0.25 });
  await crop(pl, 'plat-lasagne.jpg',             { left: 0.52, top: 0.60, width: 0.46, height: 0.25 });

  console.log('\n✅ Toutes les images ont été extraites dans public/menu-images/\n');
}

main().catch(console.error);
