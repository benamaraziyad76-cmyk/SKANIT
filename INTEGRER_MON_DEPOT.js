const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC_DIR = path.join(__dirname, 'AJOUTER_PHOTOS_MENU');
const DEST_DIR = path.join(__dirname, 'public', 'menu-images');

if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });

async function crop(srcFile, destFile, region) {
  try {
    if (!fs.existsSync(srcFile)) {
      return;
    }
    const meta = await sharp(srcFile).metadata();
    const w = meta.width;
    const h = meta.height;
    
    let left   = Math.round(region.left   * w);
    let top    = Math.round(region.top    * h);
    let width  = Math.round(region.width  * w);
    let height = Math.round(region.height * h);
    
    left = Math.max(0, Math.min(left, w - 1));
    top = Math.max(0, Math.min(top, h - 1));
    width = Math.min(width, w - left);
    height = Math.min(height, h - top);

    await sharp(srcFile)
      .extract({ left, top, width, height })
      .flatten({ background: '#ffffff' })
      .resize(800, 800, { 
         fit: 'cover',
         withoutEnlargement: false
      })
      .jpeg({ quality: 90 })
      .toFile(path.join(DEST_DIR, destFile));
      
    console.log(`  ✅ ${destFile}`);
  } catch (e) {
    console.error(`  ❌ Erreur sur ${destFile}: ${e.message}`);
  }
}

async function main() {
  console.log('\n=== DECOUPE EXACTE POUR CHAQUE PLAT ===\n');

  // 1. SANDWICHES (3639.jpg)
  const sw = path.join(SRC_DIR, '3639.jpg');
  await crop(sw, 'sandwich-americain.jpg', { left: 0.05, top: 0.18, width: 0.42, height: 0.16 });
  await crop(sw, 'sandwich-chicken.jpg',   { left: 0.53, top: 0.18, width: 0.42, height: 0.16 });
  await crop(sw, 'sandwich-kebab.jpg',     { left: 0.05, top: 0.38, width: 0.42, height: 0.16 });
  await crop(sw, 'sandwich-royal.jpg',     { left: 0.53, top: 0.38, width: 0.42, height: 0.16 });
  await crop(sw, 'sandwich-special.jpg',   { left: 0.05, top: 0.58, width: 0.42, height: 0.16 });
  await crop(sw, 'sandwich-boursin.jpg',   { left: 0.53, top: 0.58, width: 0.42, height: 0.16 });
  await crop(sw, 'sandwich-wrap-1v.jpg',   { left: 0.05, top: 0.78, width: 0.28, height: 0.16 });
  await crop(sw, 'sandwich-wrap-2v.jpg',   { left: 0.35, top: 0.78, width: 0.28, height: 0.16 });
  await crop(sw, 'sandwich-wrap-3v.jpg',   { left: 0.65, top: 0.78, width: 0.28, height: 0.16 });

  // 2. PLATS CUISINÉS (3641.jpg)
  const plats = path.join(SRC_DIR, '3641.jpg');
  await crop(plats, 'plat-escalope-milanaise.jpg', { left: 0.05, top: 0.18, width: 0.42, height: 0.20 });
  await crop(plats, 'plat-steak-cheval.jpg',       { left: 0.53, top: 0.18, width: 0.42, height: 0.20 });
  await crop(plats, 'plat-poulet-normand.jpg',     { left: 0.05, top: 0.42, width: 0.42, height: 0.20 });
  await crop(plats, 'plat-entrecote.jpg',          { left: 0.53, top: 0.42, width: 0.42, height: 0.20 });
  await crop(plats, 'plat-escalope-gratinee.jpg',  { left: 0.05, top: 0.66, width: 0.42, height: 0.20 });
  await crop(plats, 'plat-lasagne.jpg',            { left: 0.53, top: 0.66, width: 0.42, height: 0.20 });

  // 3. CHEESE NAAN (3654.jpg)
  const naan = path.join(SRC_DIR, '3654.jpg');
  await crop(naan, 'naan-radical.jpg',     { left: 0.05, top: 0.15, width: 0.42, height: 0.18 });
  await crop(naan, 'naan-royal.jpg',       { left: 0.53, top: 0.15, width: 0.42, height: 0.18 });
  await crop(naan, 'naan-boursin.jpg',     { left: 0.05, top: 0.35, width: 0.42, height: 0.18 });
  await crop(naan, 'naan-tenders.jpg',     { left: 0.53, top: 0.35, width: 0.42, height: 0.18 });
  await crop(naan, 'naan-steak.jpg',       { left: 0.05, top: 0.55, width: 0.42, height: 0.18 });
  await crop(naan, 'naan-kebab.jpg',       { left: 0.53, top: 0.55, width: 0.42, height: 0.18 });
  await crop(naan, 'naan-tandori.jpg',     { left: 0.53, top: 0.35, width: 0.42, height: 0.18 });
  await crop(naan, 'naan-poulet-curry.jpg',{ left: 0.53, top: 0.35, width: 0.42, height: 0.18 });
  await crop(naan, 'naan-chicken.jpg',     { left: 0.53, top: 0.15, width: 0.42, height: 0.18 });
  await crop(naan, 'naan-veggie.jpg',      { left: 0.05, top: 0.55, width: 0.42, height: 0.18 });
  await crop(naan, 'naan-special.jpg',     { left: 0.05, top: 0.15, width: 0.42, height: 0.18 });
  await crop(naan, 'naan-montagnard.jpg',  { left: 0.05, top: 0.35, width: 0.42, height: 0.18 });
  await crop(naan, 'naan-phenomene.jpg',   { left: 0.05, top: 0.55, width: 0.42, height: 0.18 });

  // 4. NAAN BURGER (3656.jpg)
  const naanburger = path.join(SRC_DIR, '3656.jpg');
  await crop(naanburger, 'naanburger-big-naan.jpg',     { left: 0.05, top: 0.18, width: 0.42, height: 0.22 });
  await crop(naanburger, 'naanburger-cowboy.jpg',       { left: 0.53, top: 0.18, width: 0.42, height: 0.22 });
  await crop(naanburger, 'naanburger-crispy-chickn.jpg',{ left: 0.05, top: 0.45, width: 0.42, height: 0.22 });
  await crop(naanburger, 'naanburger-chevre-miel.jpg',  { left: 0.53, top: 0.45, width: 0.42, height: 0.22 });
  await crop(naanburger, 'naanburger-le-smashe.jpg',    { left: 0.05, top: 0.70, width: 0.42, height: 0.22 });
  await crop(naanburger, 'naanburger-boursin.jpg',      { left: 0.53, top: 0.70, width: 0.42, height: 0.22 });

  console.log('\n✅ Toutes les images sont extraites et centrées !\n');
}

main().catch(console.error);
