import { expect, test } from '@playwright/test';

test.describe('Region page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ile-de-france');
  });

  test('should display the region page with departments', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Île-de-France');
    await expect(page.locator('h1')).toContainText(/\d+ lieux/);
    await expect(page.getByText('Filtrer par département')).toBeVisible();
    await expect(page.getByRole('link', { name: /Paris/ })).toBeVisible();
  });

  test('should display the list button', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Afficher la liste/ })).toBeVisible();
  });

  test('should navigate to department page', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/ile-de-france\/seine-et-marne(\?|$)/),
      page.getByRole('link', { name: /Seine-et-Marne/ }).click()
    ]);
  });

  test('should navigate to lieux list', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/ile-de-france\/lieux/),
      page.getByRole('link', { name: /Afficher la liste/ }).click()
    ]);
  });
});

test.describe('Region page breadcrumbs', () => {
  test('should navigate back to France via breadcrumb', async ({ page }) => {
    await page.goto('/ile-de-france');

    await expect(page.getByRole('link', { name: 'France' })).toBeVisible();

    await Promise.all([page.waitForURL('http://localhost:3000/'), page.getByRole('link', { name: 'France' }).click()]);
  });
});

test.describe('Region page 404', () => {
  test('should display 404 for unknown region', async ({ page }) => {
    const response = await page.goto('/region-inexistante');

    expect(response?.status()).toBe(404);
  });
});
