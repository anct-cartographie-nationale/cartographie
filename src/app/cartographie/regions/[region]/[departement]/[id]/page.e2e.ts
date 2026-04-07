import { expect, test } from '@playwright/test';

test.describe('Legacy /cartographie/regions/[region]/[departement]/[id] redirect', () => {
  test('should redirect to /[region]/[departement]/lieux/[id]', async ({ page }) => {
    // Get a valid lieu ID
    await page.goto('/ile-de-france/seine-et-marne/lieux');
    await Promise.all([page.waitForURL(/\/lieux\/.+/), page.locator('[data-testid="lieu-card"]').first().click()]);
    const lieuId = page.url().split('/lieux/')[1];

    // Test legacy URL redirect
    await page.goto(`/cartographie/regions/ile-de-france/seine-et-marne/${lieuId}`);

    await expect(page).toHaveURL(/\/ile-de-france\/seine-et-marne\/lieux\//);
    await expect(page).not.toHaveURL(/\/cartographie/);
  });
});
