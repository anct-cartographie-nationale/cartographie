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

  test('should keep the address out of the page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Lieux les plus proches de votre recherche/);
    await expect(page).not.toHaveTitle(/Brest/);
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

const waitForMapToSettle = async (page: Page) => {
  await mapCanvas(page).waitFor();
  await page.waitForTimeout(1500);
};

const storedZoom = (page: Page): Promise<number> =>
  page.evaluate(() => JSON.parse(sessionStorage.getItem('mapLocation') ?? '{}').zoom);

test.describe('Liste qui suit la carte', () => {
  test('should stay on the department list when the map only frames it', async ({ page }) => {
    await page.goto('/bretagne/finistere');
    await waitForMapToSettle(page);

    await expect(page).toHaveURL('/bretagne/finistere');
    await expect(page.locator('h1')).toContainText(/\d+ lieux trouvés/);
  });

  test('should sort the list around the centre of the map after a drag', async ({ page }) => {
    await page.goto('/bretagne/finistere');
    await waitForMapToSettle(page);

    await dragMap(page, { x: -150, y: 0 });

    await expect(page).toHaveURL(/\/autour\?lat=[\d.-]+&lng=[\d.-]+$/);
    await expect(page.locator('h1')).toHaveText(/lieux les plus proches du centre de la carte/);
    await expect(page.getByRole('status').filter({ hasText: 'Lieu le plus proche' })).toBeAttached();
    await expect(page.locator('[data-testid="lieu-card"]').first()).not.toContainText(/à (moins de )?\d/);
    await expect(page.getByRole('link', { name: /Voir tous les lieux du département/ })).toBeVisible();
  });

  test('should not move the map again nor the zoom when the list follows it', async ({ page }) => {
    await page.goto(LANDERNEAU);
    await waitForMapToSettle(page);
    await mapCanvas(page).focus();
    await page.keyboard.press('Minus');
    await waitForMapToSettle(page);
    const zoom = await storedZoom(page);

    await dragMap(page, { x: -100, y: 40 });
    await expect(page.locator('h1')).toHaveText(/centre de la carte/);
    await waitForMapToSettle(page);

    expect(zoom).toBeLessThan(13);
    expect(await storedZoom(page)).toBeCloseTo(zoom, 1);
  });

  test('should go back to the department in one step after several moves', async ({ page }) => {
    await page.goto('/bretagne/finistere');
    await waitForMapToSettle(page);

    await dragMap(page, { x: -120, y: 0 });
    await expect(page).toHaveURL(/\/autour\?lat=/);
    const firstUrl = page.url();
    await waitForMapToSettle(page);

    await dragMap(page, { x: -120, y: 60 });
    await expect(page).not.toHaveURL(firstUrl);

    await page.goBack();

    await expect(page).toHaveURL('/bretagne/finistere');
  });

  test('should go back to the address and frame it again after a move', async ({ page }) => {
    await page.goto('/bretagne/finistere');
    await page.goto(LANDERNEAU);
    await waitForMapToSettle(page);

    await dragMap(page, { x: -150, y: 0 });
    await expect(page.locator('h1')).toHaveText(/centre de la carte/);
    await waitForMapToSettle(page);

    await page.goBack();

    await expect(page.locator('h1')).toHaveText(/59 rue de Brest/);
    await waitForMapToSettle(page);
    const location = await page.evaluate(() => JSON.parse(sessionStorage.getItem('mapLocation') ?? '{}'));
    expect(location.lat).toBeCloseTo(48.4508, 2);
    expect(location.lng).toBeCloseTo(-4.2576, 2);
  });

  test('should follow a move made with the keyboard', async ({ page }) => {
    await page.goto(LANDERNEAU);
    await waitForMapToSettle(page);

    await mapCanvas(page).focus();
    await page.keyboard.press('ArrowRight');

    await expect(page.locator('h1')).toHaveText(/centre de la carte/);
    await expect(mapCanvas(page)).toBeFocused();
  });

  test('should keep the filters when the list follows the map', async ({ page }) => {
    await page.goto('/bretagne/finistere?services=Aide+aux+d%C3%A9marches+administratives');
    await waitForMapToSettle(page);

    await dragMap(page, { x: -150, y: 0 });

    await expect(page).toHaveURL(/\/autour\?services=Aide/);
  });

  test('should keep the searched location out of the marker links and of the map requests', async ({ page }) => {
    const chunkRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/lieux/chunk')) chunkRequests.push(request.url());
    });

    await page.goto(LANDERNEAU);
    await waitForMapToSettle(page);

    expect(chunkRequests.length).toBeGreaterThan(0);
    expect(chunkRequests.filter((url) => /[?&](lat|lng|adresse|commune)=/.test(url))).toEqual([]);
    const markerHrefs = await page
      .locator('a[href^="/lieux/"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
    expect(markerHrefs.filter((href) => /[?&](lat|lng|adresse|commune)=/.test(href))).toEqual([]);
  });
});

test.describe('Lieux autour de la position de l’utilisateur', () => {
  test.use({ geolocation: { latitude: 48.450798, longitude: -4.257626 }, permissions: ['geolocation'] });

  test('should list the nearest lieux with their distance and take the focus', async ({ page }) => {
    await page.goto('/bretagne/finistere');
    await waitForMapToSettle(page);

    await page.getByRole('button', { name: 'Se géolocaliser' }).click();

    await expect(page).toHaveURL(/\/autour\?lat=48\.450798&lng=-4\.257626&geolocalise=1/);
    await expect(page.locator('h1')).toHaveText(/lieux les plus proches de votre position/);
    await expect(page.locator('h1')).toBeFocused();
    await expect(page.locator('[data-testid="lieu-card"]').first()).toContainText(/à (moins de )?\d/);
    await expect(page.getByRole('link', { name: 'Voir tous les lieux du département : Finistère' })).toBeVisible();
  });
});
