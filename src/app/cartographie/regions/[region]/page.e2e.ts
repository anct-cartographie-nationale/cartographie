import { expect, test } from '@playwright/test';

test.describe('Legacy /cartographie/regions/[region] redirect', () => {
  test('should redirect to /[region]', async ({ page }) => {
    await page.goto('/cartographie/regions/ile-de-france');

    await expect(page).toHaveURL(/\/ile-de-france/);
    await expect(page).not.toHaveURL(/\/cartographie/);
  });
});
