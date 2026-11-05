import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the homepage with regions', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/lieux.*inclusion numérique/);
    await expect(page.getByText('Filtrer par région')).toBeVisible();
    await expect(page.locator('main').getByRole('link', { name: 'Île-de-France', exact: true })).toBeVisible();
  });

  test('should display the list button', async ({ page }) => {
    await expect(page.getByRole('link', { name: /Afficher la liste/ })).toBeVisible();
  });
});

test.describe('Search', () => {
  test('searches and navigates to location', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="postal"]', '75001');

    await expect(page.locator('[role="option"]').first()).toBeVisible({ timeout: 15000 });

    await page.locator('[role="option"]').first().click();

    await expect(page).not.toHaveURL(/^\/$/);
  });
});

test.describe('Geographic Navigation', () => {
  test('navigates from home to region to department to lieu list', async ({ page }) => {
    await page.goto('/');
    await Promise.all([page.waitForURL(/\/ile-de-france$/), page.click('text=Île-de-France')]);

    await page.waitForSelector('h1');
    await expect(page.locator('h1')).toContainText('Île-de-France');

    await Promise.all([page.waitForURL(/\/ile-de-france\/seine-et-marne(\?|$)/), page.click('text=Seine-et-Marne')]);

    await Promise.all([page.waitForURL(/\/ile-de-france\/seine-et-marne\/lieux$/), page.click('text=Afficher la liste')]);

    await expect(page.locator('[data-testid="lieu-card"]').first()).toBeVisible();
  });

  test('navigates to lieu detail and back via breadcrumbs', async ({ page }) => {
    await page.goto('/ile-de-france/seine-et-marne/lieux');

    await Promise.all([page.waitForURL(/\/lieux\/.+$/), page.locator('[data-testid="lieu-card"]').first().click()]);

    await expect(page.locator('h1')).toBeVisible();

    await Promise.all([page.waitForURL(/\/ile-de-france\/seine-et-marne(\?|$)/), page.click('text=Seine-et-Marne')]);
  });
});

test.describe('Homepage filters', () => {
  test.use({ viewport: { width: 1280, height: 600 } });

  test('should update the region counters on the map without scrolling anything', async ({ page, request }) => {
    await page.goto('/');
    const bretagne = page.locator('a[aria-label^="Bretagne :"]');
    await expect(bretagne).toHaveAttribute('aria-label', /[1-9]\d* lieux/, { timeout: 30_000 });
    const filter = page.getByRole('button', { name: 'Besoins' });
    await expect
      .poll(() => filter.evaluate((button) => Object.keys(button).some((key) => key.startsWith('__reactProps'))))
      .toBe(true);

    await filter.click();
    await page.locator('#services-maitrise-des-outils-numeriques-du-quotidien').check();
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL(/services=/);

    const stats = await (await request.get(`/api/stats${new URL(page.url()).search}`)).json();
    const expected = stats.regions.find(({ slug }: { slug: string }) => slug === 'bretagne').nombreLieux;
    await expect(bretagne).toHaveAttribute('aria-label', `Bretagne : ${expected} lieux`, { timeout: 30_000 });
    const scrolledElements = await page.evaluate(
      () => [...document.querySelectorAll('*')].filter((element) => element.scrollTop > 0).length
    );
    expect(scrolledElements).toBe(0);
  });
});
