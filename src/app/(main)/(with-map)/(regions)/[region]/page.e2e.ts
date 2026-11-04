import { expect, type Page, test } from '@playwright/test';

const markPageAsLoaded = async (page: Page) => {
  await page.waitForFunction(() => {
    const link = document.querySelector('main a');
    return link != null && Object.keys(link).some((key) => key.startsWith('__reactProps'));
  });
  await page.evaluate(() => {
    document.documentElement.dataset['loaded'] = 'true';
  });
};

const expectNoPageReload = (page: Page) => expect(page.locator('html')).toHaveAttribute('data-loaded', 'true');

const storedZoom = (page: Page): Promise<number | undefined> =>
  page.evaluate(() => JSON.parse(sessionStorage.getItem('mapLocation') ?? '{}').zoom);

test.describe('Region page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ile-de-france');
  });

  test('should display the region page with departments', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Île-de-France');
    await expect(page.locator('h1')).toContainText(/\d+ lieux/);
    await expect(page.getByText('Filtrer par département')).toBeVisible();
    await expect(page.locator('main').getByRole('link', { name: /\(75\) Paris/ })).toBeVisible();
  });

  test('should display the list button', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Afficher la liste/ })).toBeVisible();
  });

  test('should navigate to department page', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/ile-de-france\/seine-et-marne(\?|$)/),
      page
        .locator('main')
        .getByRole('link', { name: /Seine-et-Marne/ })
        .click()
    ]);
  });

  test('should navigate to lieux list', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/ile-de-france\/lieux/),
      page.getByRole('link', { name: /Afficher la liste/ }).click()
    ]);
  });

  test('should navigate to lieux list without reloading the page', async ({ page }) => {
    await markPageAsLoaded(page);

    await Promise.all([
      page.waitForURL(/\/ile-de-france\/lieux/),
      page.getByRole('link', { name: /Afficher la liste/ }).click()
    ]);

    await expectNoPageReload(page);
  });
});

test.describe('Region page breadcrumbs', () => {
  test('should navigate back to France via breadcrumb', async ({ page }) => {
    await page.goto('/ile-de-france');

    await expect(page.getByRole('link', { name: 'France' })).toBeVisible();

    await Promise.all([page.waitForURL('/'), page.getByRole('link', { name: 'France' }).click()]);
  });

  test('should zoom out the map without reloading the page', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('/ile-de-france');
    await page.locator('.maplibregl-marker').first().waitFor({ timeout: 45_000 });
    await expect.poll(() => storedZoom(page), { timeout: 30_000 }).toBeGreaterThan(7);
    await markPageAsLoaded(page);

    await Promise.all([page.waitForURL('/'), page.getByRole('link', { name: 'France' }).click()]);

    await expect.poll(() => storedZoom(page), { timeout: 30_000 }).toBeLessThan(7);
    await expectNoPageReload(page);
  });
});

test.describe('Region page 404', () => {
  test('should display 404 for unknown region', async ({ page }) => {
    await page.goto('/region-inexistante');

    await expect(page.getByRole('heading', { name: 'Page non trouvée' })).toBeVisible();
  });
});
