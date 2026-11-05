import { expect, type Page, test } from '@playwright/test';

const HOST_PAGE = 'http://localhost:5173/e2e.html';
const DEPARTEMENT = '/ile-de-france/seine-et-marne';
const HOST_SCROLL = 100;

const mapMarkers = (page: Page) => page.locator('.maplibregl-marker');

const openAt = async (page: Page, route: string) => {
  await page.goto(`${HOST_PAGE}?route-initiale=${encodeURIComponent(route)}`);
  await page.evaluate(() => {
    document.documentElement.dataset['loaded'] = 'true';
  });
};

const applyFilter = async (page: Page) => {
  const filter = page.getByRole('button', { name: 'Besoins' });
  await expect
    .poll(() => filter.evaluate((button) => Object.keys(button).some((key) => key.startsWith('__reactProps'))), {
      timeout: 30_000
    })
    .toBe(true);
  await filter.click();
  await page.locator('#services-maitrise-des-outils-numeriques-du-quotidien').check();
  await page.keyboard.press('Escape');
};

const lieuxCount = async (page: Page): Promise<string | undefined> =>
  (await page.locator('h1').first().textContent())?.match(/(\d+)\s*lieux/)?.[1];

const settledFilteredCount = async (page: Page, unfiltered: string | undefined): Promise<string | undefined> => {
  await expect.poll(() => lieuxCount(page), { timeout: 30_000 }).not.toBe(unfiltered);
  await expect.poll(() => lieuxCount(page), { timeout: 30_000 }).not.toBe('0');
  return lieuxCount(page);
};

const storedLocation = (page: Page): Promise<string | null> => page.evaluate(() => sessionStorage.getItem('mapLocation'));

const waitForMapToSettle = async (page: Page) => {
  let previous: string | null | undefined;
  let stablePolls = 0;
  await expect
    .poll(
      async () => {
        const location = await storedLocation(page);
        stablePolls = location !== null && location === previous ? stablePolls + 1 : 0;
        previous = location;
        return stablePolls >= 3;
      },
      { timeout: 45_000, intervals: [700] }
    )
    .toBe(true);
};

const backToList = (page: Page) => page.getByRole('link', { name: /Retour à la liste/ });

test.describe('Web component', () => {
  test.describe.configure({ timeout: 120_000 });

  test('should apply a filter without scrolling the host page', async ({ page }) => {
    await openAt(page, DEPARTEMENT);
    await expect(page.locator('h1')).toContainText(/[1-9]\d* lieux/, { timeout: 30_000 });
    const unfiltered = await lieuxCount(page);
    await page.evaluate((top) => window.scrollTo(0, top), HOST_SCROLL);

    await applyFilter(page);
    await settledFilteredCount(page, unfiltered);

    expect(await page.evaluate(() => window.scrollY)).toBe(HOST_SCROLL);
    await expect(page.locator('html')).toHaveAttribute('data-loaded', 'true');
  });

  test('should not scroll the host page when following a link and coming back', async ({ page }) => {
    await openAt(page, DEPARTEMENT);
    const card = page.locator('[data-testid="lieu-card"]').first();
    await card.waitFor({ timeout: 30_000 });
    await page.evaluate((top) => window.scrollTo(0, top), HOST_SCROLL);

    await card.click();
    await backToList(page).waitFor();
    expect(await page.evaluate(() => window.scrollY)).toBe(HOST_SCROLL);

    await backToList(page).click();
    await card.waitFor();
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => window.scrollY)).toBe(HOST_SCROLL);
  });

  test('should keep the filter when coming back from a fiche', async ({ page }) => {
    await openAt(page, DEPARTEMENT);
    await expect(page.locator('h1')).toContainText(/[1-9]\d* lieux/, { timeout: 30_000 });
    const unfiltered = await lieuxCount(page);
    await applyFilter(page);
    const filtered = await settledFilteredCount(page, unfiltered);

    await page.locator('[data-testid="lieu-card"]').first().click();
    await backToList(page).click();

    await expect.poll(() => lieuxCount(page), { timeout: 30_000 }).toBe(filtered);
  });

  test('should apply to the list a filter chosen on a fiche opened directly', async ({ page }) => {
    await openAt(page, DEPARTEMENT);
    await expect(page.locator('h1')).toContainText(/[1-9]\d* lieux/, { timeout: 30_000 });
    const unfiltered = await lieuxCount(page);
    await applyFilter(page);
    const filtered = await settledFilteredCount(page, unfiltered);

    await openAt(page, `${DEPARTEMENT}/lieux/1893`);
    await backToList(page).waitFor({ timeout: 30_000 });
    await applyFilter(page);
    await expect(backToList(page)).toHaveAttribute('href', /services=/);
    await backToList(page).click();

    await expect.poll(() => lieuxCount(page), { timeout: 30_000 }).toBe(filtered);
  });

  test('should come back to the same view of the map from a fiche', async ({ page }) => {
    await openAt(page, '/autour?lat=48.54&lng=2.66');
    await mapMarkers(page).first().waitFor({ timeout: 45_000 });
    await waitForMapToSettle(page);
    const canvas = page.locator('canvas.maplibregl-canvas');
    await canvas.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('h1')).toHaveText(/centre de la carte/, { timeout: 30_000 });
    await waitForMapToSettle(page);
    await page.waitForTimeout(1500);
    const markers = await mapMarkers(page).count();
    const before = JSON.parse((await storedLocation(page)) ?? '{}');

    const pin = await page.evaluate(() => {
      const centres = [...document.querySelectorAll('.maplibregl-marker')]
        .filter((marker) => !/\d/.test(marker.textContent ?? ''))
        .map((marker) => marker.getBoundingClientRect());
      const visible = centres.find(
        ({ top, left, bottom, right }) => top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth
      );
      return visible && { x: visible.left + visible.width / 2, y: visible.top + visible.height / 2 };
    });
    expect(pin).toBeDefined();
    await page.mouse.click(pin?.x ?? 0, pin?.y ?? 0);
    await backToList(page).click();

    await expect(page.locator('h1')).toHaveText(/centre de la carte/, { timeout: 30_000 });
    await expect(mapMarkers(page)).toHaveCount(markers, { timeout: 30_000 });
    await canvas.focus();
    await page.keyboard.press('ArrowRight');
    await waitForMapToSettle(page);
    const after = JSON.parse((await storedLocation(page)) ?? '{}');
    expect(after.zoom).toBeCloseTo(before.zoom, 1);
  });
});
