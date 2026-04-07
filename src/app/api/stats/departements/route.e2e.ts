import { expect, test } from '@playwright/test';

test.describe('Stats departements endpoint', () => {
  test('should return departements stats array', async ({ request }) => {
    const response = await request.get('/api/stats/departements');

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty('code');
    expect(data[0]).toHaveProperty('nombreLieux');
  });

  test('should accept filter params', async ({ request }) => {
    const response = await request.get('/api/stats/departements?accessibilite=eq.true');

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
