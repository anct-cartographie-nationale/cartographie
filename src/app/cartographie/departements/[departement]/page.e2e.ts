import { expect, test } from '@playwright/test';

test.describe('Legacy /cartographie/departements/[departement] redirect', () => {
  test('should redirect to /[region]/[departement]', async ({ page }) => {
    await page.goto('/cartographie/departements/seine-et-marne');

    await expect(page).toHaveURL(/\/ile-de-france\/seine-et-marne/);
  });
});
