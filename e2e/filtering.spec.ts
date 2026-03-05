import { expect, test } from '@playwright/test';

test.describe('Filtering and Pagination', () => {
  test('applies filters and updates list', async ({ page }) => {
    await page.goto('/lieux');

    // Open "Besoins" filter
    await page.click('button:has-text("Besoins")');

    // Wait for popover to be visible and select a filter option
    await page.waitForSelector('#services-maitrise-des-outils-numeriques-du-quotidien');
    await page.check('#services-maitrise-des-outils-numeriques-du-quotidien');

    // Close popover (triggers submit)
    await page.keyboard.press('Escape');

    // Verify badge shows "1"
    await expect(page.locator('.indicator-item')).toContainText('1');

    // Verify URL contains filter
    await expect(page).toHaveURL(/services=/);
  });

  test('pagination navigates between pages', async ({ page }) => {
    await page.goto('/lieux');

    // Wait for list to load
    await expect(page.locator('[data-testid="lieu-card"]').first()).toBeVisible();

    // Go to page 2 using specific pagination selector
    await page.click('[title="Page 2"]');

    // Verify page parameter in URL
    await expect(page).toHaveURL(/page=2/);

    // Verify list still has items
    await expect(page.locator('[data-testid="lieu-card"]').first()).toBeVisible();
  });
});
