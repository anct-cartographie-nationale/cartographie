import { expect, test } from '@playwright/test';

test.describe('Stats total endpoint', () => {
  test('should return total lieux count', async ({ request }) => {
    const response = await request.get('/api/stats/total');

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('totalLieux');
    expect(typeof data.totalLieux).toBe('number');
    expect(data.totalLieux).toBeGreaterThan(0);
  });

  test('should accept filter params', async ({ request }) => {
    const response = await request.get('/api/stats/total?accessibilite=eq.true');

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('totalLieux');
    expect(typeof data.totalLieux).toBe('number');
  });
});
