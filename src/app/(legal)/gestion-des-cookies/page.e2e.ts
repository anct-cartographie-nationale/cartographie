import { expect, test } from '@playwright/test';

test.describe('Gestion des cookies page', () => {
  test('should display the page with content', async ({ page }) => {
    await page.goto('/gestion-des-cookies');

    await expect(page.locator('h1')).toContainText(/cookies/i);
    await expect(page.locator('main')).toBeVisible();
  });
});
