import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { createDb } from './index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function runMigrations(customDbPath?: string, migrationsFolder?: string) {
  const db = createDb(customDbPath);
  const folder = migrationsFolder || path.resolve(__dirname, '../drizzle');
  migrate(db, { migrationsFolder: folder });
  return db;
}

if (process.argv[1] === __filename) {
  console.log('Running database migrations...');
  runMigrations();
  console.log('Migrations completed successfully.');
}
