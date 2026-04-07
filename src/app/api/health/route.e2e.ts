import { expect, test } from '@playwright/test';

test.describe('Health check endpoint', () => {
  test('should return status ok', async ({ request }) => {
    const response = await request.get('/api/health');

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok' });
  });
});
