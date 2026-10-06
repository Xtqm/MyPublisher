import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import * as schema from './schema/index.js';

export * from './schema/index.js';

export function getDatabasePath(customPath?: string): string {
  if (customPath) return customPath;
  if (process.env.DATABASE_PATH) return process.env.DATABASE_PATH;
  const dataDir = path.resolve(process.cwd(), 'data');
  return path.join(dataDir, 'mypublisher.db');
}

export function createDb(dbPath?: string) {
  const resolvedPath = getDatabasePath(dbPath);
  if (resolvedPath !== ':memory:') {
    const dir = path.dirname(resolvedPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const sqlite = new Database(resolvedPath);

  if (resolvedPath !== ':memory:') {
    sqlite.pragma('journal_mode = WAL');
    sqlite.pragma('foreign_keys = ON');
  }

  return drizzle(sqlite, { schema });
}

export type DbClient = ReturnType<typeof createDb>;
