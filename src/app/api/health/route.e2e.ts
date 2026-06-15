import { expect, test } from '@playwright/test';

test.describe('Health check endpoint', () => {
  test('should return status ok', async ({ request }) => {
    const response = await request.get('/api/health');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.cache.lastRefreshedAt === null || typeof body.cache.lastRefreshedAt === 'string').toBe(true);
  });
});
