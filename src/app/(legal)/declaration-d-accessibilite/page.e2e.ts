import { expect, test } from '@playwright/test';

test.describe("Déclaration d'accessibilité page", () => {
  test('should display the page with content', async ({ page }) => {
    await page.goto('/declaration-d-accessibilite');

    await expect(page.locator('h1')).toContainText(/accessibilité/i);
    await expect(page.locator('main')).toBeVisible();
  });
});
