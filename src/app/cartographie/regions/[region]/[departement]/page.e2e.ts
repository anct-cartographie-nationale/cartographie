import { expect, test } from '@playwright/test';

test.describe('Legacy /cartographie/regions/[region]/[departement] redirect', () => {
  test('should redirect to /[region]/[departement]', async ({ page }) => {
    await page.goto('/cartographie/regions/ile-de-france/seine-et-marne');

    await expect(page).toHaveURL(/\/ile-de-france\/seine-et-marne/);
    await expect(page).not.toHaveURL(/\/cartographie/);
  });
});
