import { expect, test } from '@playwright/test';

test.describe('Search', () => {
  test('searches and navigates to location', async ({ page }) => {
    await page.goto('/');

    // Type in search
    await page.fill('input[placeholder*="postal"]', '75001');

    // Wait for autocomplete
    await expect(page.locator('[role="listbox"]')).toBeVisible();

    // Select first result
    await page.locator('[role="option"]').first().click();

    // Verify navigation occurred
    await expect(page).not.toHaveURL(/^\/$/);
  });
});
