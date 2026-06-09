const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Ziyad\\.gemini\\antigravity\\brain\\58200f22-8ae8-4a18-8069-afbb5ab300fe';
const destDir = path.join(__dirname, 'public', 'menu-images');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const filesToCopy = [
    { prefix: 'bacon_isolated', dest: 'ingredient-bacon.png' },
    { prefix: 'crudites_isolated', dest: 'ingredient-crudites.png' },
    { prefix: 'egg_isolated', dest: 'ingredient-egg.png' }
];

const files = fs.readdirSync(srcDir);

for (const copyTask of filesToCopy) {
    const matchedFile = files.find(f => f.startsWith(copyTask.prefix) && f.endsWith('.png'));
    if (matchedFile) {
        fs.copyFileSync(path.join(srcDir, matchedFile), path.join(destDir, copyTask.dest));
        console.log(`Copied ${matchedFile} to ${copyTask.dest}`);
    } else {
        console.log(`Could not find file starting with ${copyTask.prefix}`);
    }
}
