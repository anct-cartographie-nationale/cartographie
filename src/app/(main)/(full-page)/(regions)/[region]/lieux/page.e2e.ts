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

test.describe('Region lieux list page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ile-de-france/lieux');
  });

  test('should display the lieux list', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/\d+ lieux trouvés/);
    await expect(page.locator('[data-testid="lieu-card"]').first()).toBeVisible();
  });

  test('should display map button', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Afficher la carte/ })).toBeVisible();
  });

  test('should display export button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Exporter/ })).toBeVisible();
  });

  test('should navigate to lieu detail', async ({ page }) => {
    await Promise.all([page.waitForURL(/\/lieux\/.+/), page.locator('[data-testid="lieu-card"]').first().click()]);

    await expect(page.locator('h1')).toBeVisible();
  });

  test('should paginate lieux list', async ({ page }) => {
    await Promise.all([page.waitForURL(/page=2/), page.click('[title="Page 2"]')]);

    await expect(page.locator('[data-testid="lieu-card"]').first()).toBeVisible();
  });

  test('should display the breadcrumb without horizontal scroll', async ({ page }) => {
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');

    await expect(breadcrumb).toBeVisible();
    expect(await breadcrumb.evaluate((nav) => nav.scrollWidth - nav.clientWidth)).toBeLessThanOrEqual(0);
  });

  test('should paginate lieux list without reloading the page', async ({ page }) => {
    await markPageAsLoaded(page);

    await Promise.all([page.waitForURL(/page=2/), page.click('[title="Page 2"]')]);

    await expectNoPageReload(page);
  });

  test('should navigate to map view without reloading the page', async ({ page }) => {
    await markPageAsLoaded(page);

    await Promise.all([
      page.waitForURL(/\/ile-de-france(\?|$)/),
      page.getByRole('link', { name: /Afficher la carte/ }).click()
    ]);

    await expectNoPageReload(page);
  });

  test('should navigate to map view', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/ile-de-france(\?|$)/),
      page.getByRole('link', { name: /Afficher la carte/ }).click()
    ]);
  });
});

test.describe('Region lieux list page breadcrumbs', () => {
  test('should navigate back to France via breadcrumb', async ({ page }) => {
    await page.goto('/ile-de-france/lieux');

    await Promise.all([page.waitForURL('/'), page.getByRole('link', { name: 'France', exact: true }).click()]);
  });
});

test.describe('Region lieux list page 404', () => {
  test('should display 404 for unknown region', async ({ page }) => {
    await page.goto('/region-inexistante/lieux');

    await expect(page.getByRole('heading', { name: 'Page non trouvée' })).toBeVisible();
  });
});
