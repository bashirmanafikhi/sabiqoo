import * as fs from 'node:fs';
import * as path from 'node:path';

type JsonObject = { [key: string]: unknown };

const ROOT = path.resolve(__dirname, '..');
const AR_PATH = path.join(ROOT, 'src', 'i18n', 'ar.json');
const EN_PATH = path.join(ROOT, 'src', 'i18n', 'en.json');

function flatten(
  obj: unknown,
  prefix = '',
  out: Map<string, string> = new Map(),
): Map<string, string> {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    if (prefix) out.set(prefix, typeof obj === 'string' ? obj : String(obj));
    return out;
  }
  for (const [key, value] of Object.entries(obj as JsonObject)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      flatten(value, next, out);
    } else {
      out.set(next, typeof value === 'string' ? value : String(value));
    }
  }
  return out;
}

function readJson(filePath: string): unknown {
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(
      `check-i18n: failed to parse ${path.relative(ROOT, filePath)} as JSON: ${
        (err as Error).message
      }`,
    );
    process.exit(2);
  }
}

function diff(a: Map<string, string>, b: Map<string, string>) {
  const missingInA: string[] = [];
  const missingInB: string[] = [];
  for (const k of a.keys()) if (!b.has(k)) missingInB.push(k);
  for (const k of b.keys()) if (!a.has(k)) missingInA.push(k);
  missingInA.sort();
  missingInB.sort();
  return { missingInA, missingInB };
}

function main() {
  if (!fs.existsSync(AR_PATH)) {
    console.error(`check-i18n: missing file ${path.relative(ROOT, AR_PATH)}`);
    process.exit(2);
  }
  if (!fs.existsSync(EN_PATH)) {
    console.error(`check-i18n: missing file ${path.relative(ROOT, EN_PATH)}`);
    process.exit(2);
  }

  const arFlat = flatten(readJson(AR_PATH));
  const enFlat = flatten(readJson(EN_PATH));

  const { missingInA, missingInB } = diff(arFlat, enFlat);

  const emptyValues: string[] = [];
  for (const [k, v] of arFlat.entries()) {
    if (!v.trim()) emptyValues.push(`ar:${k}`);
  }
  for (const [k, v] of enFlat.entries()) {
    if (!v.trim()) emptyValues.push(`en:${k}`);
  }
  emptyValues.sort();

  let failed = false;

  if (missingInA.length > 0) {
    console.error(
      `check-i18n: FAIL — EN is missing ${missingInA.length} key(s) present in AR (AR is authoritative):`,
    );
    for (const k of missingInA) console.error(`  - ${k}`);
    failed = true;
  }

  if (missingInB.length > 0) {
    console.error(
      `check-i18n: WARN — AR is missing ${missingInB.length} key(s) present in EN (AR should be authoritative):`,
    );
    for (const k of missingInB) console.error(`  - ${k}`);
    failed = true;
  }

  if (emptyValues.length > 0) {
    console.error(
      `check-i18n: FAIL — ${emptyValues.length} empty value(s) detected:`,
    );
    for (const k of emptyValues) console.error(`  - ${k}`);
    failed = true;
  }

  if (failed) {
    console.error('check-i18n: key parity FAILED');
    process.exit(1);
  }

  console.log(
    `check-i18n: key parity OK (${arFlat.size} keys in ar.json, ${enFlat.size} keys in en.json)`,
  );
}

main();
