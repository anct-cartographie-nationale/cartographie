import { expect, type Page, test } from '@playwright/test';

const waitForHydration = (page: Page) =>
  page.waitForFunction(() => {
    const link = document.querySelector('main a');
    return link != null && Object.keys(link).some((key) => key.startsWith('__reactProps'));
  });

const highestScrollTop = (page: Page): Promise<number> =>
  page.evaluate(() => Math.max(...[...document.querySelectorAll('*')].map(({ scrollTop }) => scrollTop)));

test.describe('Department page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ile-de-france/seine-et-marne');
  });

  test('should come back to the very top when changing page', async ({ page }) => {
    await waitForHydration(page);
    const secondPage = page.locator('[title="Page 2"]');

    await secondPage.click();

    await expect(secondPage).toHaveClass(/btn-primary/);
    await expect(page).toHaveURL(/page=2/);
    expect(await highestScrollTop(page)).toBe(0);
  });

  test('should display the department page with lieux list', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/\d+ lieux trouvés/);
    await expect(page.locator('[data-testid="lieu-card"]').first()).toBeVisible();
  });

  test('should display export button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Exporter/ })).toBeVisible();
  });

  test('should navigate to lieu detail', async ({ page }) => {
    await Promise.all([page.waitForURL(/\/lieux\/.+/), page.locator('[data-testid="lieu-card"]').first().click()]);

    await expect(page.locator('h1')).toBeVisible();
  });

  test('should paginate lieux list', async ({ page }) => {
    await Promise.all([page.waitForURL(/page=2/), page.click('[title="Page 2"]')]);

    await expect(page.locator('[data-testid="lieu-card"]').first()).toBeVisible();
  });
});

test.describe('Department page breadcrumbs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ile-de-france/seine-et-marne');
  });

  test('should navigate back to region via breadcrumb', async ({ page }) => {
    await Promise.all([page.waitForURL(/\/ile-de-france(\?|$)/), page.getByRole('link', { name: 'Île-de-France' }).click()]);
  });

  test('should navigate back to France via breadcrumb', async ({ page }) => {
    await Promise.all([page.waitForURL('/'), page.getByRole('link', { name: 'France', exact: true }).click()]);
  });
});

test.describe('Department page 404', () => {
  test('should display 404 for unknown department', async ({ page }) => {
    await page.goto('/ile-de-france/departement-inexistant');

    await expect(page.getByRole('heading', { name: 'Page non trouvée' })).toBeVisible();
  });

  test('should display 404 for department not in region', async ({ page }) => {
    await page.goto('/ile-de-france/ain');

    await expect(page.getByRole('heading', { name: 'Page non trouvée' })).toBeVisible();
  });
});
