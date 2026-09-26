/* eslint-disable */
// Patches expo-sqlite/build/index.js + legacy/index.js to add .js extensions
// to extensionless ESM re-exports (required on Node 22+ where the strict
// ESM resolver rejects "export * from './X'"). Runs automatically via the
// "postinstall" script in package.json; safe to run multiple times.

const fs = require('fs');
const path = require('path');

const TARGETS = [
  'node_modules/expo-sqlite/build/index.js',
  'node_modules/expo-sqlite/build/legacy/index.js',
];

const ROOT = path.resolve(__dirname, '..');

let patched = 0;
for (const rel of TARGETS) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  let src = fs.readFileSync(p, 'utf8');
  const before = src;
  src = src.replace(
    /export \* from '\.\/([^']+)'/g,
    (_m, mod) => {
      // already has .js? leave it
      if (mod.endsWith('.js')) return `export * from './${mod}'`;
      // skip .types-only / .d.ts
      if (mod.endsWith('.d.ts') || mod.endsWith('.types')) return `export * from './${mod}.js'`;
      return `export * from './${mod}.js'`;
    },
  );
  if (src !== before) {
    fs.writeFileSync(p, src, 'utf8');
    patched++;
    console.log(`[patch-expo-sqlite] patched ${rel}`);
  }
}
console.log(`[patch-expo-sqlite] total files patched: ${patched}`);
