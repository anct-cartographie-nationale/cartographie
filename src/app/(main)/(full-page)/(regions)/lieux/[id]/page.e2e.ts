import { expect, test } from '@playwright/test';

test.describe('Lieu redirect page', () => {
  test('should redirect to full path with region and department', async ({ page }) => {
    // First navigate to a lieu detail to get a valid ID
    await page.goto('/ile-de-france/seine-et-marne/lieux');
    await Promise.all([page.waitForURL(/\/lieux\/.+/), page.locator('[data-testid="lieu-card"]').first().click()]);

    // Extract lieu ID from current URL
    const url = page.url();
    const lieuId = url.split('/lieux/')[1];

    // Navigate via /lieux/[id] and verify redirect
    await page.goto(`/lieux/${lieuId}`);

    await expect(page).toHaveURL(/\/ile-de-france\/seine-et-marne\/lieux\//);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display 404 for unknown lieu', async ({ page }) => {
    const response = await page.goto('/lieux/lieu-inexistant-12345');

    expect(response?.status()).toBe(404);
  });
});
