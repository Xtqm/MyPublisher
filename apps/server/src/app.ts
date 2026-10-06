import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { type EnvConfig } from './config.js';
import { logger } from './logger.js';
import { createHealthRouter } from './routes/health.js';

export function createApp(config: EnvConfig) {
  const app = new Hono();

  // Structured request logging middleware
  app.use('*', async (c, next) => {
    const start = Date.now();
    await next();
    const durationMs = Date.now() - start;
    logger.info('HTTP Request', {
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      durationMs,
    });
  });

  // Basic CORS for development
  app.use('*', cors());

  // API v1 router
  const apiV1 = new Hono();
  apiV1.route('/', createHealthRouter(config));

  app.route('/api/v1', apiV1);

  // 404 handler
  app.notFound((c) => {
    return c.json({ error: 'Not Found', path: c.req.path }, 404);
  });

  // Global error handler
  app.onError((err, c) => {
    logger.error('Unhandled server error', { error: err.message, stack: err.stack });
    return c.json({ error: 'Internal Server Error' }, 500);
  });

  return app;
}
