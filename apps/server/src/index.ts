import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { logger } from './logger.js';

const config = loadConfig();
const app = createApp(config);

serve(
  {
    fetch: app.fetch,
    port: config.PORT,
  },
  (info) => {
    logger.info(`MyPublisher server started on http://localhost:${info.port}`, {
      port: info.port,
      nodeEnv: config.NODE_ENV,
      databasePath: config.DATABASE_PATH,
    });
  },
);
