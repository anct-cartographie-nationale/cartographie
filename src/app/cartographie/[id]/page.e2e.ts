import { expect, test } from '@playwright/test';

test.describe('Legacy /cartographie/[id] redirect', () => {
  test('should redirect to /lieux/[id]', async ({ page }) => {
    // Get a valid lieu ID
    await page.goto('/ile-de-france/seine-et-marne/lieux');
    await Promise.all([page.waitForURL(/\/lieux\/.+/), page.locator('[data-testid="lieu-card"]').first().click()]);
    const lieuId = page.url().split('/lieux/')[1];

    // Test legacy URL redirect
    await page.goto(`/cartographie/${lieuId}`);

    await expect(page).toHaveURL(/\/lieux\//);
  });
});
