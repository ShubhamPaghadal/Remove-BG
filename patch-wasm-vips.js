#!/usr/bin/env node
/**
 * Patch @denodecom/wasm-vips ES6 files to remove import.meta.url patterns
 * that Vite cannot resolve at build time.
 *
 * Run: node patch-wasm-vips.js
 */
const fs = require('fs');
const path = require('path');

const files = [
    'node_modules/@denodecom/wasm-vips/lib/vips-es6.js',
    'node_modules/@denodecom/wasm-vips/lib/nosimd/vips-es6.js',
    'node_modules/@denodecom/wasm-vips/lib/lowmem/vips-es6.js',
    'node_modules/@denodecom/wasm-vips/lib/nosimd/lowmem/vips-es6.js',
];

const PATCH_MARKER = '/* @wasm-vips-patched */';

for (const relPath of files) {
    const absPath = path.resolve(__dirname, relPath);

    if (!fs.existsSync(absPath)) {
        console.log('SKIP (not found):', relPath);
        continue;
    }

    let code = fs.readFileSync(absPath, 'utf-8');

    if (code.includes(PATCH_MARKER)) {
        console.log('ALREADY PATCHED:', relPath);
        continue;
    }

    const original = code;

    // 1. Replace: new URL("./",import.meta.url) — used for base path detection
    //    Vite sees this as an asset reference and can't resolve it
    code = code.replace(
        /new URL\("\.\/",import\.meta\.url\)/g,
        '"."'
    );

    // 2. Replace: new URL("vips.wasm",import.meta.url) — WASM file location
    //    Vite tries to emit vips.wasm as a bundled asset, fails because file not found
    code = code.replace(
        /new URL\("vips\.wasm",import\.meta\.url\)/g,
        '"vips.wasm"'
    );

    // 3. Replace: new Worker(new URL(import.meta.url), options) — pthread self-spawn
    //    Vite can't resolve import.meta.url as a worker source at build time
    code = code.replace(
        /new Worker\(new URL\(import\.meta\.url\),/g,
        'new Worker(import.meta.url,'
    );

    // Add patch marker at top
    code = PATCH_MARKER + '\n' + code;

    if (code !== original) {
        fs.writeFileSync(absPath, code, 'utf-8');
        console.log('PATCHED:', relPath);
    } else {
        console.log('NO CHANGES:', relPath);
    }
}

console.log('Done.');
