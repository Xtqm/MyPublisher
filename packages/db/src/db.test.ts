import { describe, it, expect } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { systemMetadata } from './schema/placeholder.js';
import { eq } from 'drizzle-orm';

describe('SQLite Database & Drizzle', () => {
  it('connects to in-memory sqlite and performs queries on placeholder table', () => {
    const sqlite = new Database(':memory:');
    const db = drizzle(sqlite, { schema: { systemMetadata } });

    // Create table directly in memory for isolated test
    sqlite.exec(`
      CREATE TABLE system_metadata (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    const now = new Date();
    db.insert(systemMetadata)
      .values({
        key: 'schema_version',
        value: '1.0.0',
        createdAt: now,
        updatedAt: now,
      })
      .run();

    const record = db
      .select()
      .from(systemMetadata)
      .where(eq(systemMetadata.key, 'schema_version'))
      .get();

    expect(record).toBeDefined();
    expect(record?.key).toBe('schema_version');
    expect(record?.value).toBe('1.0.0');
    expect(record?.createdAt.getTime()).toBe(now.getTime());
  });
});
