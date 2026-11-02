import { expect, test } from '@playwright/test';

test.describe('Intégrer la cartographie page', () => {
  test('should generate an integration link for a departement', async ({ page }) => {
    await page.goto('/integrer');

    await expect(page.locator('h1')).toContainText(/intégrer la cartographie/i);

    await page.getByRole('combobox', { name: 'Département' }).selectOption('29');

    await expect(page.getByText('Territoire sélectionné : Finistère')).toBeVisible();
    await expect(page.locator('code')).toContainText('/bretagne/finistere?territoire_type=departements&territoires=29');
  });

  test('should switch to the web component code', async ({ page }) => {
    await page.goto('/integrer');

    await page.getByRole('combobox', { name: 'Département' }).selectOption('29');
    await page.getByRole('tab', { name: 'Code à intégrer' }).click();

    await expect(page.locator('code')).toContainText('<cartographie-inclusion-numerique');
    await expect(page.locator('code')).toContainText('route-initiale="/bretagne/finistere"');
  });
});
