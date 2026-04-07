import { expect, test } from '@playwright/test';

test.describe('Lieu detail page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a lieu detail from the list
    await page.goto('/ile-de-france/seine-et-marne/lieux');
    await Promise.all([page.waitForURL(/\/lieux\/.+/), page.locator('[data-testid="lieu-card"]').first().click()]);
  });

  test('should display the lieu name', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display back to list button', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Retour à la liste/ })).toBeVisible();
  });

  test('should display report error button', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Signaler une erreur/ })).toBeVisible();
  });

  test('should display copy link button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copier le lien/ })).toBeVisible();
  });

  test('should navigate back to list', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/ile-de-france\/seine-et-marne(\?|$)/),
      page.getByRole('link', { name: /Retour à la liste/ }).click()
    ]);
  });
});

test.describe('Lieu detail page breadcrumbs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ile-de-france/seine-et-marne/lieux');
    await Promise.all([page.waitForURL(/\/lieux\/.+/), page.locator('[data-testid="lieu-card"]').first().click()]);
  });

  test('should navigate to department via breadcrumb', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/ile-de-france\/seine-et-marne(\?|$)/),
      page.getByRole('link', { name: 'Seine-et-Marne' }).click()
    ]);
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

test.describe('Lieu detail page 404', () => {
  test('should display 404 for unknown lieu', async ({ page }) => {
    const response = await page.goto('/ile-de-france/seine-et-marne/lieux/lieu-inexistant-12345');

    expect(response?.status()).toBe(404);
  });
});
