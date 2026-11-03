import { expect, test } from '@playwright/test';

const fillEmailAndPickFinistere = async (page: Parameters<Parameters<typeof test>[2]>[0]['page']) => {
  await page.goto('/integrer');
  await page.getByRole('textbox', { name: /adresse e-mail/i }).fill('marie.dupont@example.fr');
  await page.getByRole('combobox', { name: 'Département' }).selectOption('29');
  await expect(page.getByText('Territoire sélectionné : Finistère')).toBeVisible();
};

test.describe('Intégrer la cartographie page', () => {
  test('should require an email before showing the integration', async ({ page }) => {
    await page.goto('/integrer');

    await expect(page.locator('h1')).toContainText(/intégrer la cartographie/i);

    await page.getByRole('combobox', { name: 'Département' }).selectOption('29');

    await expect(page.getByText(/renseignez votre adresse e-mail/i)).toBeVisible();
    await expect(page.locator('code')).toHaveCount(0);
  });

  test('should generate an integration link for a departement', async ({ page }) => {
    await fillEmailAndPickFinistere(page);

    await expect(page.locator('code')).toContainText('/bretagne/finistere?territoire_type=departements&territoires=29');
  });

  test('should show the iframe code by default and switch to the web component code', async ({ page }) => {
    await fillEmailAndPickFinistere(page);
    await page.getByRole('tab', { name: 'Code à intégrer' }).click();

    await expect(page.locator('code')).toContainText('<iframe');
    await expect(page.locator('code')).toContainText('integration=iframe');

    await page.getByRole('radio', { name: /web component/i }).check();

    await expect(page.locator('code')).toContainText('<cartographie-inclusion-numerique');
    await expect(page.locator('code')).toContainText('route-initiale="/bretagne/finistere"');
  });

  test('should offer a downloadable QR code', async ({ page }) => {
    await fillEmailAndPickFinistere(page);
    await page.getByRole('tab', { name: 'QR code' }).click();

    await expect(page.getByRole('img', { name: /qr code/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /télécharger le qr code/i })).toHaveAttribute(
      'download',
      'qr-code-bretagne-finistere.png'
    );
  });

  test('should display the support contact', async ({ page }) => {
    await page.goto('/integrer');

    await expect(page.getByRole('link', { name: 'carto@inclusion-numerique.anct.gouv.fr' })).toBeVisible();
  });
});
