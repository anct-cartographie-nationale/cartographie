import { expect, test } from '@playwright/test';

test.describe('Données personnelles page', () => {
  test('should display the page with content', async ({ page }) => {
    await page.goto('/donnees-personnelles');

    await expect(page.locator('h1')).toContainText(/données personnelles/i);
    await expect(page.locator('main')).toBeVisible();
  });
});
