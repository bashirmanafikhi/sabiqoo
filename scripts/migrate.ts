// scripts/migrate.ts
//
// Standalone migration script: applies the bundled DDL to a SQLite database
// file. Re-runnable via `npm run db:migrate`.
//
// The canonical SQL lives in `src/db/migrate.ts` so both the dev script
// (this file, via better-sqlite3) and the runtime app (via expo-sqlite) keep
// a single source of truth.

import * as fs from 'node:fs';
import * as path from 'node:path';
import Database from 'better-sqlite3';
import { MIGRATION_SQL } from '../src/db/migrate';

const DEFAULT_DB_PATH = path.resolve(process.cwd(), 'sabiqoo.db');
const DB_PATH = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : DEFAULT_DB_PATH;

function ensureParentDir(filePath: string): void {
  const parent = path.dirname(filePath);
  if (!fs.existsSync(parent)) {
    fs.mkdirSync(parent, { recursive: true });
  }
}

function main(): void {
  ensureParentDir(DB_PATH);
  const db = new Database(DB_PATH);
  try {
    db.pragma('foreign_keys = ON');
    db.exec(MIGRATION_SQL);
    console.log(`migrate: applied DDL to ${path.relative(process.cwd(), DB_PATH)}`);
  } finally {
    db.close();
  }
}

main();
