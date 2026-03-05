import { expect, test } from '@playwright/test';

test.describe('Geographic Navigation', () => {
  test('navigates from home to region to department to lieu list', async ({ page }) => {
    // Home → Region
    await page.goto('/');
    await Promise.all([page.waitForURL(/\/ile-de-france$/), page.click('text=Île-de-France')]);

    // Wait for h1 to be rendered (it's inside a Subscribe component)
    await page.waitForSelector('h1');
    await expect(page.locator('h1')).toContainText('Île-de-France');

    // Region → Department
    await Promise.all([page.waitForURL(/\/ile-de-france\/seine-et-marne$/), page.click('text=Seine-et-Marne')]);

    // Department → Lieux list
    await Promise.all([
      page.waitForURL(/\/ile-de-france\/seine-et-marne\/lieux$/),
      page.click('text=Afficher la liste')
    ]);

    // Verify list has items
    await expect(page.locator('[data-testid="lieu-card"]').first()).toBeVisible();
  });

  test('navigates to lieu detail and back via breadcrumbs', async ({ page }) => {
    await page.goto('/ile-de-france/seine-et-marne/lieux');

    // Click first lieu
    await Promise.all([page.waitForURL(/\/lieux\/.+$/), page.locator('[data-testid="lieu-card"]').first().click()]);

    // Verify detail page
    await expect(page.locator('h1')).toBeVisible();

    // Navigate back via breadcrumb
    await Promise.all([page.waitForURL(/\/ile-de-france\/seine-et-marne$/), page.click('text=Seine-et-Marne')]);
  });
});
