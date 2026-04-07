import { expect, test } from '@playwright/test';

test.describe('Lieux list page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lieux');
  });

  test('should display the lieux list', async ({ page }) => {
    await expect(page.locator('[data-testid="lieu-card"]').first()).toBeVisible();
  });

  test('applies filters and updates list', async ({ page }) => {
    await page.click('button:has-text("Besoins")');

    await page.waitForSelector('#services-maitrise-des-outils-numeriques-du-quotidien');
    await page.check('#services-maitrise-des-outils-numeriques-du-quotidien');

    await page.keyboard.press('Escape');

    await expect(page.locator('.indicator-item')).toContainText('1');

    await expect(page).toHaveURL(/services=/);
  });

  test('pagination navigates between pages', async ({ page }) => {
    await expect(page.locator('[data-testid="lieu-card"]').first()).toBeVisible();

    await Promise.all([page.waitForURL(/page=2/), page.click('[title="Page 2"]')]);

    await expect(page.locator('[data-testid="lieu-card"]').first()).toBeVisible();
  });
});
