import { GenericContainer, type StartedTestContainer, Wait } from 'testcontainers';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Nginx reverse proxy', () => {
  let container: StartedTestContainer;
  let baseUrl: string;

  beforeAll(async () => {
    const dbipDate = new Date().toISOString().slice(0, 7);

    const image = await GenericContainer.fromDockerfile('./', 'Dockerfile')
      .withBuildArgs({ DBIP_DATE: dbipDate })
      .build('cartographie-infra-test', { deleteOnExit: false });

    container = await image
      .withExposedPorts(80)
      .withEnvironment({ HOSTNAME: '0.0.0.0' })
      .withWaitStrategy(Wait.forHttp('/api/health', 80))
      .start();

    baseUrl = `http://${container.getHost()}:${container.getMappedPort(80)}`;
  });

  afterAll(async () => {
    await container?.stop();
  });

  describe('geo-restriction', () => {
    describe('pays autorisés', () => {
      it.each([
        { country: 'France', code: 'FR', ip: '193.252.19.3' },
        { country: 'Polynésie française', code: 'PF', ip: '202.3.224.1' },
        { country: 'Allemagne', code: 'DE', ip: '217.0.0.1' },
        { country: 'Andorre', code: 'AD', ip: '91.187.64.1' },
        { country: 'Belgique', code: 'BE', ip: '81.246.0.1' },
        { country: 'Espagne', code: 'ES', ip: '88.0.0.1' },
        { country: 'Italie', code: 'IT', ip: '79.0.0.1' },
        { country: 'Luxembourg', code: 'LU', ip: '158.64.0.1' },
        { country: 'Monaco', code: 'MC', ip: '88.209.64.1' },
        { country: 'Royaume-Uni', code: 'GB', ip: '86.0.0.1' },
        { country: 'Suisse', code: 'CH', ip: '178.195.0.1' },
        { country: 'États-Unis', code: 'US', ip: '8.8.8.8' },
        { country: 'Finlande', code: 'FI', ip: '91.152.0.1' }
      ])('autorise le trafic depuis $country ($code / $ip)', async ({ ip }) => {
        const response = await fetch(baseUrl, {
          headers: { 'X-Forwarded-For': ip }
        });

        expect(response.status).toBe(200);
      });

      // Les DOM-TOM (GP, MQ, GF, RE, YT, PM, NC, WF, BL, MF) utilisent
      // principalement des IP résolues comme FR par DB-IP Lite (ISP français).
      // Ils sont couverts par la whitelist FR.
    });

    describe('pays bloqués', () => {
      it.each([
        { country: 'Chine', code: 'CN', ip: '114.114.114.114' },
        { country: 'Russie', code: 'RU', ip: '77.88.8.8' },
        { country: 'Iran', code: 'IR', ip: '5.160.0.1' },
        { country: 'Brésil', code: 'BR', ip: '177.0.0.1' },
        { country: 'Inde', code: 'IN', ip: '49.44.0.1' },
        { country: 'Nigéria', code: 'NG', ip: '197.210.0.1' },
        { country: 'Viêt Nam', code: 'VN', ip: '14.160.0.1' },
        { country: 'Ukraine', code: 'UA', ip: '91.196.0.1' },
        { country: 'Pakistan', code: 'PK', ip: '39.32.0.1' },
        { country: 'Kazakhstan', code: 'KZ', ip: '95.56.0.1' },
        { country: 'Biélorussie', code: 'BY', ip: '93.84.0.1' }
      ])('bloque le trafic depuis $country ($code / $ip)', async ({ ip }) => {
        const response = await fetch(baseUrl, {
          headers: { 'X-Forwarded-For': ip }
        });

        expect(response.status).toBe(403);
      });
    });

    describe('anti-spoofing X-Forwarded-For', () => {
      it('bloque quand la dernière IP est dans un pays non autorisé', async () => {
        const response = await fetch(baseUrl, {
          headers: { 'X-Forwarded-For': '193.252.19.3, 114.114.114.114' }
        });

        expect(response.status).toBe(403);
      });

      it('autorise quand la dernière IP est dans un pays autorisé', async () => {
        const response = await fetch(baseUrl, {
          headers: { 'X-Forwarded-For': '114.114.114.114, 193.252.19.3' }
        });

        expect(response.status).toBe(200);
      });
    });
  });

  describe('health check', () => {
    it('répond sans géo-restriction ni cache', async () => {
      const response = await fetch(`${baseUrl}/api/health`);

      expect(response.status).toBe(200);
      expect(response.headers.get('X-Cache-Status')).toBeNull();
    });
  });

  describe('cache', () => {
    it('retourne MISS puis HIT pour la même requête', async () => {
      const path = `/cache-test-${Date.now()}`;
      const headers = { 'X-Forwarded-For': '193.252.19.3' };

      const first = await fetch(`${baseUrl}${path}`, { headers });
      expect(first.headers.get('X-Cache-Status')).toBe('MISS');

      const second = await fetch(`${baseUrl}${path}`, { headers });
      expect(second.headers.get('X-Cache-Status')).toBe('HIT');
    });

    it('ne cache pas les requêtes bloquées par le géo-filter', async () => {
      const response = await fetch(baseUrl, {
        headers: { 'X-Forwarded-For': '114.114.114.114' }
      });

      expect(response.status).toBe(403);
      expect(response.headers.get('X-Cache-Status')).toBeNull();
    });

    it('crée des entrées cache distinctes par page', async () => {
      const headers = { 'X-Forwarded-For': '193.252.19.3' };

      const pageA = await fetch(`${baseUrl}/page-a-${Date.now()}`, { headers });
      expect(pageA.headers.get('X-Cache-Status')).toBe('MISS');

      const pageB = await fetch(`${baseUrl}/page-b-${Date.now()}`, { headers });
      expect(pageB.headers.get('X-Cache-Status')).toBe('MISS');
    });
  });

  describe('page 403 personnalisée', () => {
    it('affiche un message en français pour les requêtes bloquées', async () => {
      const response = await fetch(baseUrl, {
        headers: { 'X-Forwarded-For': '114.114.114.114' }
      });
      const body = await response.text();

      expect(body).toContain('lang="fr"');
      expect(body).toContain('Service non disponible depuis votre position');
      expect(body).toContain('territoire français');
    });
  });

  describe('compression', () => {
    it("compresse les réponses avec gzip quand le client l'accepte", async () => {
      const response = await fetch(baseUrl, {
        headers: {
          'X-Forwarded-For': '193.252.19.3',
          'Accept-Encoding': 'gzip'
        }
      });

      expect(response.headers.get('Content-Encoding')).toBe('gzip');
    });
  });

  describe('sécurité', () => {
    it('masque la version de Nginx dans le header Server', async () => {
      const response = await fetch(baseUrl, {
        headers: { 'X-Forwarded-For': '193.252.19.3' }
      });
      const server = response.headers.get('Server');

      expect(server).not.toMatch(/\d+\.\d+/);
    });

    it('limite le débit à 10 req/s par IP (429 au-delà du burst)', async () => {
      const headers = { 'X-Forwarded-For': '193.252.19.3' };
      const requests = Array.from({ length: 50 }, () =>
        fetch(`${baseUrl}/rate-limit-${Date.now()}-${Math.random()}`, { headers }).then((r) => r.status)
      );

      const statuses = await Promise.all(requests);
      const tooManyRequests = statuses.filter((s) => s === 429);

      expect(tooManyRequests.length).toBeGreaterThan(0);
    });
  });

  describe('CrowdSec', () => {
    it('le LAPI est accessible dans le container', async () => {
      const result = await container.exec(['wget', '-qO-', 'http://127.0.0.1:8080/health']);

      expect(result.exitCode).toBe(0);
    });

    it('le bouncer est enregistré', async () => {
      const result = await container.exec(['cscli', 'bouncers', 'list', '-o', 'raw']);

      expect(result.output).toContain('nginx-bouncer');
    });
  });
});
