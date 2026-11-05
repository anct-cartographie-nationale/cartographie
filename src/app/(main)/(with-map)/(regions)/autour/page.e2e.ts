import { expect, type Page, test } from '@playwright/test';

const LANDERNEAU = '/autour?lat=48.450798&lng=-4.257626&adresse=59+rue+de+Brest+29800+Landerneau&commune=29103';

test.describe('Lieux autour d’une adresse', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LANDERNEAU);
  });

  test('should list the nearest lieux first with their distance', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText(/lieux les plus proches de 59 rue de Brest 29800 Landerneau/);

    const firstCard = page.locator('[data-testid="lieu-card"]').first();
    await expect(firstCard).toContainText('Landerneau');
    await expect(firstCard).toContainText(/à (moins de )?\d+(,\d)? ?(m|km)/);
  });

  test('should have a dedicated page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Lieux les plus proches de votre recherche/);
  });

  test('should display the breadcrumb of the territory', async ({ page }) => {
    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });

    await expect(breadcrumb.getByRole('link', { name: 'Bretagne' })).toHaveAttribute('href', '/bretagne');
    await expect(breadcrumb.getByRole('link', { name: 'Finistère' })).toHaveAttribute('href', '/bretagne/finistere');
    await expect(breadcrumb).toContainText('À proximité');
  });

  test('should lead back to every lieu of the department', async ({ page }) => {
    await Promise.all([
      page.waitForURL('/bretagne/finistere'),
      page.getByRole('link', { name: 'Voir tous les lieux du département : Finistère' }).click()
    ]);

    await expect(page.locator('h1')).toContainText(/\d+ lieux trouvés/);
  });

  test('should keep the address when changing page', async ({ page }) => {
    await page.getByRole('link', { name: 'Page suivante' }).click();

    await expect(page).toHaveURL(/lat=48\.450798.*page=2/);
    await expect(page.locator('h1')).toHaveText(/lieux les plus proches de 59 rue de Brest/);
  });

  test('should not carry the address to the fiche of a lieu', async ({ page }) => {
    const href = await page.locator('main ul a').first().getAttribute('href');

    expect(href).toMatch(/^\/bretagne\/finistere\/lieux\//);
    expect(href).not.toMatch(/lat=|lng=|adresse=|commune=/);
  });
});

test.describe('Lieux autour d’une adresse avec une URL invalide', () => {
  test('should display the not found page without coordinates', async ({ page }) => {
    await page.goto('/autour?adresse=Landerneau');

    await expect(page.locator('h1')).not.toHaveText(/lieux les plus proches/);
  });
});

test.describe('API lieux autour', () => {
  test('should return the nearest lieux with their distance to an address', async ({ request }) => {
    const response = await request.get('/api/lieux/autour?lat=48.450798&lng=-4.257626&adresse=Landerneau&limit=3');
    const { lieux, totalLieux } = await response.json();

    expect(response.ok()).toBe(true);
    expect(totalLieux).toBeLessThanOrEqual(200);
    expect(lieux[0].adresse.commune).toBe('Landerneau');
    expect(lieux[0].distance).toBeDefined();
  });

  test('should not return a distance to the centre of the map', async ({ request }) => {
    const response = await request.get('/api/lieux/autour?lat=48.450798&lng=-4.257626&limit=3');
    const { lieux } = await response.json();

    expect(lieux[0].adresse.commune).toBe('Landerneau');
    expect(lieux[0].distance).toBeUndefined();
  });

  test('should respect the territory filter', async ({ request }) => {
    const response = await request.get(
      '/api/lieux/autour?lat=48.450798&lng=-4.257626&limit=1&territoire_type=departements&territoires=75'
    );
    const { lieux } = await response.json();

    expect(lieux[0].departement).toBe('paris');
  });

  test('should answer 404 without valid coordinates', async ({ request }) => {
    const response = await request.get('/api/lieux/autour?lat=abc&lng=-4');

    expect(response.status()).toBe(404);
  });
});

const mapCanvas = (page: Page) => page.locator('canvas.maplibregl-canvas');

const dragMap = async (page: Page, by: { x: number; y: number }) => {
  const box = await mapCanvas(page).boundingBox();
  if (!box) throw new Error('Map canvas not found');
  const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };

  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + by.x, start.y + by.y, { steps: 8 });
  await page.waitForTimeout(300);
  await page.mouse.up();
};

const expectOnSlowRunner = expect.configure({ timeout: 30_000 });

const STABLE_POLLS_BEFORE_SETTLED = 3;

const waitForMapToSettle = async (page: Page) => {
  await page.locator('.maplibregl-marker').first().waitFor({ timeout: 45_000 });

  const expectedLatitude = new URL(page.url()).searchParams.get('lat');
  let previousLocation: string | null | undefined;
  let stablePolls = 0;

  await expect
    .poll(
      async () => {
        const location = await page.evaluate(() => sessionStorage.getItem('mapLocation'));
        stablePolls = location === previousLocation ? stablePolls + 1 : 0;
        previousLocation = location;
        const isOnExpectedLocation =
          expectedLatitude == null ||
          (location != null && Math.abs(JSON.parse(location).lat - Number(expectedLatitude)) < 0.05);
        return isOnExpectedLocation && stablePolls >= STABLE_POLLS_BEFORE_SETTLED;
      },
      { timeout: 45_000, intervals: [700] }
    )
    .toBe(true);
};

const storedZoom = (page: Page): Promise<number> =>
  page.evaluate(() => JSON.parse(sessionStorage.getItem('mapLocation') ?? '{}').zoom);

test.describe('Liste qui suit la carte', () => {
  test.describe.configure({ timeout: 120_000 });

  test('should stay on the department list when the map only frames it', async ({ page }) => {
    await page.goto('/bretagne/finistere');
    await waitForMapToSettle(page);

    await expectOnSlowRunner(page).toHaveURL('/bretagne/finistere');
    await expectOnSlowRunner(page.locator('h1')).toContainText(/\d+ lieux trouvés/);
  });

  test('should sort the list around the centre of the map after a drag', async ({ page }) => {
    await page.goto('/bretagne/finistere');
    await waitForMapToSettle(page);

    await dragMap(page, { x: -150, y: 0 });

    await expectOnSlowRunner(page).toHaveURL(/\/autour\?lat=[\d.-]+&lng=[\d.-]+$/);
    await expectOnSlowRunner(page.locator('h1')).toHaveText(/lieux les plus proches du centre de la carte/);
    await expectOnSlowRunner(page.getByRole('status').filter({ hasText: 'Lieu le plus proche' })).toBeAttached();
    await expectOnSlowRunner(page.locator('[data-testid="lieu-card"]').first()).not.toContainText(/à (moins de )?\d/);
    await expectOnSlowRunner(page.getByRole('link', { name: /Voir tous les lieux du département/ })).toBeVisible();
  });

  test('should not move the map again nor the zoom when the list follows it', async ({ page }) => {
    await page.goto(LANDERNEAU);
    await waitForMapToSettle(page);
    await mapCanvas(page).focus();
    await page.keyboard.press('Minus');
    await waitForMapToSettle(page);
    const zoom = await storedZoom(page);

    await dragMap(page, { x: -100, y: 40 });
    await expectOnSlowRunner(page.locator('h1')).toHaveText(/centre de la carte/);
    await waitForMapToSettle(page);

    expectOnSlowRunner(zoom).toBeLessThan(13);
    expectOnSlowRunner(await storedZoom(page)).toBeCloseTo(zoom, 1);
  });

  test('should go back to the department in one step after several moves', async ({ page }) => {
    await page.goto('/bretagne/finistere');
    await waitForMapToSettle(page);

    await dragMap(page, { x: -120, y: 0 });
    await expectOnSlowRunner(page).toHaveURL(/\/autour\?lat=/);
    const firstUrl = page.url();
    await waitForMapToSettle(page);

    await dragMap(page, { x: -120, y: 60 });
    await expectOnSlowRunner(page).not.toHaveURL(firstUrl);

    await page.goBack();

    await expectOnSlowRunner(page).toHaveURL('/bretagne/finistere');
  });

  test('should go back to the address and frame it again after a move', async ({ page }) => {
    await page.goto('/bretagne/finistere');
    await page.goto(LANDERNEAU);
    await waitForMapToSettle(page);

    await dragMap(page, { x: -150, y: 0 });
    await expectOnSlowRunner(page.locator('h1')).toHaveText(/centre de la carte/);
    await waitForMapToSettle(page);

    await page.goBack();

    await expectOnSlowRunner(page.locator('h1')).toHaveText(/59 rue de Brest/);
    await waitForMapToSettle(page);
    const location = await page.evaluate(() => JSON.parse(sessionStorage.getItem('mapLocation') ?? '{}'));
    expectOnSlowRunner(location.lat).toBeCloseTo(48.4508, 2);
    expectOnSlowRunner(location.lng).toBeCloseTo(-4.2576, 2);
  });

  test('should find the map as it was when coming back from the fiche of a lieu', async ({ page }) => {
    await page.goto('/bretagne/finistere');
    await waitForMapToSettle(page);

    await dragMap(page, { x: -150, y: 0 });
    await expectOnSlowRunner(page.locator('h1')).toHaveText(/centre de la carte/);
    await waitForMapToSettle(page);
    const before = await page.evaluate(() => JSON.parse(sessionStorage.getItem('mapLocation') ?? '{}'));
    const markers = await page.locator('.maplibregl-marker').count();
    expect(markers).toBeGreaterThan(1);

    await Promise.all([
      page.waitForURL(/\/lieux\/.+$/),
      page.locator('.maplibregl-marker').filter({ hasNotText: /\d/ }).first().click({ force: true })
    ]);
    await Promise.all([page.waitForURL(/\/autour\?lat=/), page.getByRole('link', { name: /Retour à la liste/ }).click()]);
    await waitForMapToSettle(page);

    await expectOnSlowRunner(page.locator('.maplibregl-marker')).toHaveCount(markers);

    await mapCanvas(page).focus();
    await page.keyboard.press('ArrowRight');
    await waitForMapToSettle(page);

    const after = await page.evaluate(() => JSON.parse(sessionStorage.getItem('mapLocation') ?? '{}'));
    expectOnSlowRunner(after.zoom).toBeCloseTo(before.zoom, 1);
    expectOnSlowRunner(after.lat).toBeCloseTo(before.lat, 1);
  });

  for (const { name, link } of [
    {
      name: 'the link to every lieu',
      link: (page: Page) => page.getByRole('link', { name: /Voir tous les lieux du département/ })
    },
    {
      name: 'the breadcrumb',
      link: (page: Page) => page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Finistère' })
    }
  ]) {
    test(`should frame the department again from ${name}`, async ({ page }) => {
      await page.goto('/bretagne/finistere');
      await waitForMapToSettle(page);
      const departementZoom = await storedZoom(page);

      await dragMap(page, { x: -150, y: 0 });
      await expectOnSlowRunner(page.locator('h1')).toHaveText(/centre de la carte/);
      await waitForMapToSettle(page);
      await mapCanvas(page).focus();
      await page.keyboard.press('Equal');
      await waitForMapToSettle(page);
      expectOnSlowRunner(await storedZoom(page)).toBeGreaterThan(departementZoom);

      await Promise.all([page.waitForURL('/bretagne/finistere'), link(page).click()]);

      await expect.poll(() => storedZoom(page), { timeout: 30_000 }).toBeCloseTo(departementZoom, 1);
    });
  }

  for (const { territoire, href } of [
    { territoire: 'Finistère', href: '/bretagne/finistere' },
    { territoire: 'Bretagne', href: '/bretagne' }
  ]) {
    test(`should centre the map on the list when going back from ${territoire}`, async ({ page }) => {
      await page.goto('/bretagne/finistere');
      await waitForMapToSettle(page);

      await dragMap(page, { x: -150, y: 0 });
      await expectOnSlowRunner(page.locator('h1')).toHaveText(/centre de la carte/);
      await waitForMapToSettle(page);
      const longitude = Number(new URL(page.url()).searchParams.get('lng'));

      await Promise.all([
        page.waitForURL(href),
        page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: territoire }).click()
      ]);
      await expect
        .poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('mapLocation') ?? '{}').lng), { timeout: 30_000 })
        .not.toBeCloseTo(longitude, 1);

      await page.goBack();

      await expect
        .poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('mapLocation') ?? '{}').lng), { timeout: 30_000 })
        .toBeCloseTo(longitude, 1);
    });
  }

  test('should follow a move made with the keyboard', async ({ page }) => {
    await page.goto(LANDERNEAU);
    await waitForMapToSettle(page);

    await mapCanvas(page).focus();
    await page.keyboard.press('ArrowRight');

    await expectOnSlowRunner(page.locator('h1')).toHaveText(/centre de la carte/);
    await expectOnSlowRunner(mapCanvas(page)).toBeFocused();
  });

  test('should not scroll the page when the list follows the map', async ({ page }) => {
    await page.goto('/bretagne/finistere');
    await waitForMapToSettle(page);
    await page.evaluate(() => window.scrollTo(0, 120));
    const scrollBefore = await page.evaluate(() => window.scrollY);

    await dragMap(page, { x: -150, y: 0 });
    await expectOnSlowRunner(page.locator('h1')).toHaveText(/centre de la carte/);
    await waitForMapToSettle(page);

    expectOnSlowRunner(scrollBefore).toBeGreaterThan(0);
    expectOnSlowRunner(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);

    await dragMap(page, { x: -150, y: 40 });
    await waitForMapToSettle(page);

    expectOnSlowRunner(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
  });

  test('should not scroll the page when clicking a region on the map', async ({ page }) => {
    await page.goto('/');
    await waitForMapToSettle(page);
    await page.evaluate(() => window.scrollTo(0, 120));
    const scrollBefore = await page.evaluate(() => window.scrollY);

    await page.locator('.maplibregl-marker', { hasText: 'Bretagne' }).click();
    await page.waitForURL('/bretagne');
    await waitForMapToSettle(page);

    expectOnSlowRunner(scrollBefore).toBeGreaterThan(0);
    expectOnSlowRunner(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
  });

  test('should keep the filters when the list follows the map', async ({ page }) => {
    await page.goto('/bretagne/finistere?services=Aide+aux+d%C3%A9marches+administratives');
    await waitForMapToSettle(page);

    await dragMap(page, { x: -150, y: 0 });

    await expectOnSlowRunner(page).toHaveURL(/\/autour\?services=Aide/);
  });

  test('should keep the searched location out of the marker links and of the map requests', async ({ page }) => {
    const chunkRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/lieux/chunk')) chunkRequests.push(request.url());
    });

    await page.goto('/autour?lat=47.998695&lng=-4.093228&adresse=Quimper&commune=29232');
    await expectOnSlowRunner.poll(() => chunkRequests.length).toBeGreaterThan(0);
    await expectOnSlowRunner(page.locator('a[href^="/lieux/"]').first()).toBeAttached();
    expectOnSlowRunner(chunkRequests.filter((url) => /[?&](lat|lng|adresse|commune)=/.test(url))).toEqual([]);
    const markerHrefs = await page
      .locator('a[href^="/lieux/"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
    expectOnSlowRunner(markerHrefs.filter((href) => /[?&](lat|lng|adresse|commune)=/.test(href))).toEqual([]);
  });
});

test.describe('Lieux autour de la position de l’utilisateur', () => {
  test.describe.configure({ timeout: 120_000 });

  test.use({ geolocation: { latitude: 48.450798, longitude: -4.257626 }, permissions: ['geolocation'] });

  test('should list the nearest lieux with their distance and take the focus', async ({ page }) => {
    await page.goto('/bretagne/finistere');
    await waitForMapToSettle(page);

    await page.getByRole('button', { name: 'Se géolocaliser' }).click();

    await expectOnSlowRunner(page).toHaveURL(/\/autour\?lat=48\.450798&lng=-4\.257626&geolocalise=1/);
    await expectOnSlowRunner(page.locator('h1')).toHaveText(/lieux les plus proches de votre position/);
    await expectOnSlowRunner(page.locator('h1')).toBeFocused();
    await expectOnSlowRunner(page.locator('[data-testid="lieu-card"]').first()).toContainText(/à (moins de )?\d/);
    await expectOnSlowRunner(page.getByRole('link', { name: 'Voir tous les lieux du département : Finistère' })).toBeVisible();
  });
});

test.describe('Survol synchronisé entre la liste et la carte', () => {
  test.describe.configure({ timeout: 120_000 });

  const QUIMPER = '/autour?lat=47.998695&lng=-4.093228&adresse=Quimper&commune=29232';
  const highlightedMarkers = (page: Page) => page.locator('.marker-highlighted');
  const firstCard = (page: Page) => page.locator('[data-testid="lieu-card"]').first();
  const firstCardName = async (page: Page) => (await firstCard(page).locator('h2').textContent()) ?? '';

  test('should highlight the marker when hovering a card, then stop', async ({ page }) => {
    await page.goto(QUIMPER);
    await waitForMapToSettle(page);
    await expectOnSlowRunner(highlightedMarkers(page)).toHaveCount(0);

    await firstCard(page).hover();
    await expectOnSlowRunner(highlightedMarkers(page)).toHaveCount(1);

    await page.locator('h1').hover();
    await expectOnSlowRunner(highlightedMarkers(page)).toHaveCount(0);
  });

  test('should highlight the marker when focusing a card with the keyboard', async ({ page }) => {
    await page.goto(QUIMPER);
    await waitForMapToSettle(page);

    await page.locator('main ul a').first().focus();
    await expectOnSlowRunner(highlightedMarkers(page)).toHaveCount(1);

    await page.locator('main ul a').first().blur();
    await expectOnSlowRunner(highlightedMarkers(page)).toHaveCount(0);
  });

  test('should highlight the group containing a lieu of the list', async ({ page }) => {
    await page.goto(LANDERNEAU);
    await waitForMapToSettle(page);

    await firstCard(page).hover();

    await expectOnSlowRunner(highlightedMarkers(page)).toHaveCount(1);
    await expectOnSlowRunner(page.getByRole('button', { name: /Zoomer sur ce groupe de \d+ lieux/ }).first()).toBeAttached();
  });

  test('should highlight the card when focusing its marker', async ({ page }) => {
    await page.goto(QUIMPER);
    await waitForMapToSettle(page);
    const name = await firstCardName(page);

    await page.getByRole('link', { name, exact: true }).last().focus();

    await expectOnSlowRunner(firstCard(page)).toHaveClass(/ring-primary/);
  });

  test('should not move the map nor scroll the list when hovering', async ({ page }) => {
    await page.goto(QUIMPER);
    await waitForMapToSettle(page);
    const before = await page.evaluate(() => sessionStorage.getItem('mapLocation'));

    await firstCard(page).hover();
    await waitForMapToSettle(page);

    expectOnSlowRunner(await page.evaluate(() => sessionStorage.getItem('mapLocation'))).toBe(before);
    await expectOnSlowRunner(page).toHaveURL(QUIMPER);
  });
});
