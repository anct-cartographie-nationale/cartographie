import { render } from 'react-email';
import { describe, expect, it } from 'vitest';
import { IntegrationRequestEmail } from './integration-request.email';

describe('IntegrationRequestEmail', () => {
  it('should render the request details, the link and the code', async () => {
    const html = await render(
      IntegrationRequestEmail({
        email: 'marie.dupont@example.fr',
        territoire: { type: 'departement', code: '29', nom: 'Finistère' },
        vue: 'filtree',
        sortie: 'web-component',
        personnalisation: { titre: 'Lieux du Finistère', logoUrl: '', couleurPrincipale: '#ff0000' },
        lien: 'https://carto.test/bretagne/finistere?territoire_type=departements&territoires=29',
        code: '<cartographie-inclusion-numerique app-name="Lieux du Finistère" />',
        sentAt: new Date('2026-11-03T15:30:00')
      })
    );

    expect(html).toContain('mailto:marie.dupont@example.fr');
    expect(html).toContain('Département Finistère (29)');
    expect(html).toContain('Uniquement les lieux du territoire');
    expect(html).toContain('Web component');
    expect(html).toContain('Lieux du Finistère');
    expect(html).toContain('Non renseigné');
    expect(html).toContain('#ff0000');
    expect(html).toContain('https://carto.test/bretagne/finistere?territoire_type=departements&amp;territoires=29');
    expect(html).toContain('&lt;cartographie-inclusion-numerique');
  });

  it('should describe an EPCI by its number of communes', async () => {
    const html = await render(
      IntegrationRequestEmail({
        email: 'marie.dupont@example.fr',
        territoire: { type: 'epci', code: 'EPCI____0000002150236789', nom: 'Brest Métropole', nombreCommunes: 8 },
        vue: 'filtree',
        sortie: 'lien',
        lien: 'https://carto.test/bretagne/finistere',
        sentAt: new Date('2026-11-03T15:30:00')
      })
    );

    expect(html).toContain('Intercommunalité Brest Métropole (8 communes)');
    expect(html).not.toContain('EPCI____');
  });

  it('should omit the customisation and code sections for a plain link', async () => {
    const html = await render(
      IntegrationRequestEmail({
        email: 'marie.dupont@example.fr',
        territoire: { type: 'commune', code: '29019', nom: 'Brest' },
        vue: 'centree',
        sortie: 'lien',
        lien: 'https://carto.test/bretagne/finistere',
        sentAt: new Date('2026-11-03T15:30:00')
      })
    );

    expect(html).toContain('Commune Brest (29019)');
    expect(html).toContain('Carte centrée sur le territoire');
    expect(html).not.toContain('Titre');
    expect(html).not.toContain('>Code<');
  });
});
