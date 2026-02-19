const fs = require('fs');
const path = require('path');

const files = [
    'node_modules/@denodecom/wasm-vips/lib/vips-es6.js',
    'node_modules/@denodecom/wasm-vips/lib/nosimd/vips-es6.js',
    'node_modules/@denodecom/wasm-vips/lib/lowmem/vips-es6.js',
    'node_modules/@denodecom/wasm-vips/lib/nosimd/lowmem/vips-es6.js',
];

files.forEach(f => {
    const absPath = path.resolve(__dirname, f);
    if (fs.existsSync(absPath)) {
        console.log(`Patching ${f}...`);
        let content = fs.readFileSync(absPath, 'utf8');

        // 1. Break the static analysis of new URL() by masking the constructor or the arguments
        // We replace "new URL(" with "new (window.URL || URL)("
        content = content.replace(/new URL\(/g, 'new (globalThis["URL"] || URL)(');

        // 2. Break the static analysis of new Worker()
        content = content.replace(/new Worker\(/g, 'new (globalThis["Worker"] || Worker)(');

        // 3. Still replace import.meta.url just in case
        content = content.replace(/import\.meta\.url/g, 'globalThis.location?.href');

        fs.writeFileSync(absPath, content);
    } else {
        console.log(`File not found: ${f}`);
    }
});
console.log('Done.');
