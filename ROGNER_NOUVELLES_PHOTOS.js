const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC_DIR = path.join(__dirname, 'PHOTOS_NOUVELLES');
const DEST_DIR = path.join(__dirname, 'public', 'menu-images');

if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });

async function processNewImages() {
  console.log('\n=== Rognage des nouvelles photos (Centré) ===\n');
  
  const files = fs.readdirSync(SRC_DIR).filter(f => f.match(/^\d+\.jpg$/i));
  
  if (files.length === 0) {
    console.log('Aucune nouvelle photo (ex: 3639.jpg) trouvée dans PHOTOS_NOUVELLES.');
    return;
  }

  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file);
    const destPath = path.join(DEST_DIR, file);
    
    try {
      // Rogner l'image en carré 600x600 centré
      await sharp(srcPath)
        .resize(600, 600, { 
            fit: 'cover', 
            position: 'center' 
        })
        .jpeg({ quality: 95 })
        .toFile(destPath);
        
      console.log(`  ✅ ${file} -> public/menu-images/${file}`);
    } catch (e) {
      console.error(`  ❌ Erreur sur ${file}: ${e.message}`);
    }
  }
  
  console.log('\n✅ Terminé ! Les photos sont dans public/menu-images/\n');
}

processNewImages().catch(console.error);
