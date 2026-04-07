import { expect, test } from '@playwright/test';

test.describe('Mentions légales page', () => {
  test('should display the page with content', async ({ page }) => {
    await page.goto('/mentions-legales');

    await expect(page.locator('h1')).toContainText(/mentions légales/i);
    await expect(page.locator('main')).toBeVisible();
  });
});
