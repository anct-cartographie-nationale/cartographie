import { expect, type Page, test } from '@playwright/test';

test.describe('Lieu detail page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a lieu detail from the list
    await page.goto('/ile-de-france/seine-et-marne/lieux');
    await Promise.all([page.waitForURL(/\/lieux\/.+/), page.locator('[data-testid="lieu-card"]').first().click()]);
  });

  test('should display the lieu name', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display back to list button', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Retour à la liste/ })).toBeVisible();
  });

  test('should display report error button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Signaler une erreur/ })).toBeVisible();
  });

  test('should display copy link button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copier le lien/ })).toBeVisible();
  });

  test('should navigate back to list', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/ile-de-france\/seine-et-marne\/lieux(\?|$)/),
      page.getByRole('link', { name: /Retour à la liste/ }).click()
    ]);
  });
});

test.describe('Lieu detail page breadcrumbs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ile-de-france/seine-et-marne/lieux');
    await Promise.all([page.waitForURL(/\/lieux\/.+/), page.locator('[data-testid="lieu-card"]').first().click()]);
  });

  test('should navigate to department via breadcrumb', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/ile-de-france\/seine-et-marne(\?|$)/),
      page.getByRole('link', { name: 'Seine-et-Marne' }).click()
    ]);
  });

  test('should navigate to region via breadcrumb', async ({ page }) => {
    await Promise.all([page.waitForURL(/\/ile-de-france(\?|$)/), page.getByRole('link', { name: 'Île-de-France' }).click()]);
  });

  test('should navigate to France via breadcrumb', async ({ page }) => {
    await Promise.all([page.waitForURL('/'), page.getByRole('link', { name: 'France', exact: true }).click()]);
  });
});

test.describe('Lieu detail page 404', () => {
  test('should display 404 for unknown lieu', async ({ page }) => {
    await page.goto('/ile-de-france/seine-et-marne/lieux/lieu-inexistant-12345');

    await expect(page.getByRole('heading', { name: 'Page non trouvée' })).toBeVisible();
  });
});

test.describe('Lieu detail page freshness', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bretagne/finistere/lieux/269');
  });

  const badge = (page: Page) => page.getByRole('button', { name: /^(À jour|À surveiller|À vérifier|À actualiser)$/ });

  test('should display the freshness badge and where the information comes from', async ({ page }) => {
    await expect(badge(page)).toBeVisible();
    await expect(page.locator('main')).toContainText(/Mise à jour le \d{2}\/\d{2}\/\d{4} · Via /);
  });

  test('should explain the badge on focus and close the explanation with Escape', async ({ page }) => {
    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeHidden();

    await badge(page).focus();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText(/Informations/);
    await expect(badge(page)).toHaveAttribute('aria-describedby', (await tooltip.getAttribute('id')) ?? '');

    await page.keyboard.press('Escape');
    await expect(tooltip).toBeHidden();
  });

  test('should explain the badge on hover and let the pointer reach the explanation', async ({ page }) => {
    const tooltip = page.getByRole('tooltip');

    await badge(page).hover();
    await expect(tooltip).toBeVisible();

    await tooltip.hover();
    await expect(tooltip).toBeVisible();
  });
});
