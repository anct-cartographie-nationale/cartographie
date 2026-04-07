import { expect, test } from '@playwright/test';

test.describe('Department lieux list page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ile-de-france/seine-et-marne/lieux');
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
      page.waitForURL(/\/ile-de-france\/seine-et-marne(\?|$)/),
      page.getByRole('link', { name: /Afficher la carte/ }).click()
    ]);
  });
});

test.describe('Department lieux list page breadcrumbs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ile-de-france/seine-et-marne/lieux');
  });

  test('should navigate to region via breadcrumb', async ({ page }) => {
    await Promise.all([page.waitForURL(/\/ile-de-france(\?|$)/), page.getByRole('link', { name: 'Île-de-France' }).click()]);
  });

  test('should navigate to France via breadcrumb', async ({ page }) => {
    await Promise.all([
      page.waitForURL('http://localhost:3000/'),
      page.getByRole('link', { name: 'France', exact: true }).click()
    ]);
  });
});

test.describe('Department lieux list page 404', () => {
  test('should display 404 for unknown department', async ({ page }) => {
    const response = await page.goto('/ile-de-france/departement-inexistant/lieux');

    expect(response?.status()).toBe(404);
  });
});
