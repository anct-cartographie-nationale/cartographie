import { expect, test } from '@playwright/test';

test.describe('Stats region by slug endpoint', () => {
  test('should return total lieux for a region', async ({ request }) => {
    const response = await request.get('/api/stats/regions/ile-de-france');

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('totalLieux');
    expect(typeof data.totalLieux).toBe('number');
    expect(data.totalLieux).toBeGreaterThan(0);
  });

  test('should return 404 for unknown region', async ({ request }) => {
    const response = await request.get('/api/stats/regions/region-inexistante');

    expect(response.status()).toBe(404);
  });

  test('should accept filter params', async ({ request }) => {
    const response = await request.get('/api/stats/regions/ile-de-france?accessibilite=eq.true');

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('totalLieux');
  });
});
