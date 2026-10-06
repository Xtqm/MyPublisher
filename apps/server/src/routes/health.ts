import { Hono } from 'hono';
import { type HealthResponse } from '@mypublisher/shared';
import { createDb } from '@mypublisher/db';
import { type EnvConfig } from '../config.js';
import { logger } from '../logger.js';

export function createHealthRouter(config: EnvConfig) {
  const router = new Hono();

  router.get('/health', (c) => {
    let dbStatus: 'connected' | 'disconnected' = 'disconnected';

    try {
      const db = createDb(config.DATABASE_PATH);
      // Run a simple query to ensure SQLite is functional
      db.$client.prepare('SELECT 1').get();
      dbStatus = 'connected';
    } catch (err) {
      logger.error('Database health check failed', { error: String(err) });
    }

    const response: HealthResponse = {
      status: dbStatus === 'connected' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
      environment: config.NODE_ENV,
      database: dbStatus,
    };

    return c.json(response, response.status === 'ok' ? 200 : 503);
  });

  return router;
}
