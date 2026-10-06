import { describe, it, expect } from 'vitest';
import { createApp } from '../app.js';
import { HealthResponseSchema } from '@mypublisher/shared';

describe('GET /api/v1/health', () => {
  const app = createApp({
    PORT: 3000,
    NODE_ENV: 'test',
    DATABASE_PATH: ':memory:',
    LOG_LEVEL: 'error',
  });

  it('returns 200 and valid health payload with connected database', async () => {
    const res = await app.request('/api/v1/health');
    expect(res.status).toBe(200);

    const json = await res.json();
    const parsed = HealthResponseSchema.safeParse(json);

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.status).toBe('ok');
      expect(parsed.data.database).toBe('connected');
      expect(parsed.data.version).toBe('0.1.0');
    }
  });
});
