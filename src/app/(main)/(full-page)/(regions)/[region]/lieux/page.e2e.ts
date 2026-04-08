import { expect, test } from '@playwright/test';

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

    await Promise.all([
      page.waitForURL('http://localhost:3000/'),
      page.getByRole('link', { name: 'France', exact: true }).click()
    ]);
  });
});

test.describe('Region lieux list page 404', () => {
  test('should display 404 for unknown region', async ({ page }) => {
    await page.goto('/region-inexistante/lieux');

    await expect(page.getByRole('heading', { name: 'Page non trouvée' })).toBeVisible();
  });
});
