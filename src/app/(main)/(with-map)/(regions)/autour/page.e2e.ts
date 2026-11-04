import { expect, test } from '@playwright/test';

const LANDERNEAU = '/autour?lat=48.450798&lng=-4.257626&adresse=59+rue+de+Brest+29800+Landerneau&commune=29103';

test.describe('Lieux autour d’une adresse', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LANDERNEAU);
  });

  test('should list the nearest lieux first with their distance', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText(/lieux les plus proches de 59 rue de Brest 29800 Landerneau/);

    const firstCard = page.locator('[data-testid="lieu-card"]').first();
    await expect(firstCard).toContainText('Landerneau');
    await expect(firstCard).toContainText(/à (moins de )?\d+(,\d)? ?(m|km)/);
  });

  test('should keep the address out of the page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Lieux les plus proches de votre recherche/);
    await expect(page).not.toHaveTitle(/Brest/);
  });

  test('should display the breadcrumb of the territory', async ({ page }) => {
    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });

    await expect(breadcrumb.getByRole('link', { name: 'Bretagne' })).toHaveAttribute('href', '/bretagne');
    await expect(breadcrumb.getByRole('link', { name: 'Finistère' })).toHaveAttribute('href', '/bretagne/finistere');
    await expect(breadcrumb).toContainText('À proximité');
  });

  test('should lead back to every lieu of the department', async ({ page }) => {
    await Promise.all([
      page.waitForURL('/bretagne/finistere'),
      page.getByRole('link', { name: 'Voir tous les lieux du département : Finistère' }).click()
    ]);

    await expect(page.locator('h1')).toContainText(/\d+ lieux trouvés/);
  });

  test('should keep the address when changing page', async ({ page }) => {
    await page.getByRole('link', { name: 'Page suivante' }).click();

    await expect(page).toHaveURL(/lat=48\.450798.*page=2/);
    await expect(page.locator('h1')).toHaveText(/lieux les plus proches de 59 rue de Brest/);
  });

  test('should not carry the address to the fiche of a lieu', async ({ page }) => {
    const href = await page.locator('main ul a').first().getAttribute('href');

    expect(href).toMatch(/^\/bretagne\/finistere\/lieux\//);
    expect(href).not.toMatch(/lat=|lng=|adresse=|commune=/);
  });
});

test.describe('Lieux autour d’une adresse avec une URL invalide', () => {
  test('should display the not found page without coordinates', async ({ page }) => {
    await page.goto('/autour?adresse=Landerneau');

    await expect(page.locator('h1')).not.toHaveText(/lieux les plus proches/);
  });
});

test.describe('API lieux autour', () => {
  test('should return the nearest lieux', async ({ request }) => {
    const response = await request.get('/api/lieux/autour?lat=48.450798&lng=-4.257626&limit=3');
    const { lieux, totalLieux } = await response.json();

    expect(response.ok()).toBe(true);
    expect(totalLieux).toBeLessThanOrEqual(200);
    expect(lieux[0].adresse.commune).toBe('Landerneau');
    expect(lieux[0].distance).toBeDefined();
  });

  test('should respect the territory filter', async ({ request }) => {
    const response = await request.get(
      '/api/lieux/autour?lat=48.450798&lng=-4.257626&limit=1&territoire_type=departements&territoires=75'
    );
    const { lieux } = await response.json();

    expect(lieux[0].departement).toBe('paris');
  });

  test('should answer 404 without valid coordinates', async ({ request }) => {
    const response = await request.get('/api/lieux/autour?lat=abc&lng=-4');

    expect(response.status()).toBe(404);
  });
});
