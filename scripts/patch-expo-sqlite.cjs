/* eslint-disable */
// Postinstall patcher for two known incompatibilities with our stack:
//   1. expo-sqlite ships extensionless ESM re-exports that fail on Node 22+
//      where the strict ESM resolver requires .js extensions.
//   2. The Tailwind version range in package.json would let npm re-resolve
//      back to 3.4.x, which conflicts with Nativewind 2's synchronous
//      postcss pipeline (Tailwind 3.4 added async content scanning).
//
// Both patches are idempotent and safe to run multiple times.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Patch 1: expo-sqlite .js extensions
function patchExpoSqlite() {
  const targets = [
    'node_modules/expo-sqlite/build/index.js',
    'node_modules/expo-sqlite/build/legacy/index.js',
  ];
  let patched = 0;
  for (const rel of targets) {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) continue;
    let src = fs.readFileSync(p, 'utf8');
    const before = src;
    src = src.replace(
      /export \* from '\.\/([^']+)'/g,
      (_m, mod) => (mod.endsWith('.js') ? `export * from './${mod}'` : `export * from './${mod}.js'`),
    );
    if (src !== before) {
      fs.writeFileSync(p, src, 'utf8');
      patched++;
    }
  }
  if (patched) console.log(`[patch-expo-sqlite] patched ${patched} file(s)`);
}

// Patch 2: Tailwind version assertion
function assertTailwindVersion() {
  const pkgPath = path.join(ROOT, 'node_modules/tailwindcss/package.json');
  if (!fs.existsSync(pkgPath)) return;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const major = parseInt(String(pkg.version).split('.')[0], 10);
  const minor = parseInt(String(pkg.version).split('.')[1], 10);
  if (major !== 3 || minor > 2) {
    console.warn(
      `[patches] tailwindcss@${pkg.version} detected (>3.2.x breaks Nativewind 2 sync postcss). ` +
        'Re-install with `npm install tailwindcss@~3.2.7 --legacy-peer-deps --ignore-scripts`.',
    );
  } else {
    console.log(`[patches] tailwindcss@${pkg.version} OK (<=3.2.x).`);
  }
}

patchExpoSqlite();
assertTailwindVersion();
