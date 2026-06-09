const fs = require('fs');
const path = 'c:\\Users\\Ziyad\\Desktop\\teste\\src\\app\\r\\[slug]\\t\\[tableCode]\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Colors
content = content.replace(/#4a5d4e/g, '#2c2c2c');
content = content.replace(/#b35a38/g, '#e8b830');
content = content.replace(/#f8f5f0/g, '#f4f6f8');
// Remove Dolce Vita pattern
content = content.replace(/<div className="absolute inset-0 opacity-\[0.03\] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient\(#4a5d4e 1px, transparent 0\)', backgroundSize: '40px 40px' }} \/>/g, '');

fs.writeFileSync(path, content);
console.log("Colors updated!");
