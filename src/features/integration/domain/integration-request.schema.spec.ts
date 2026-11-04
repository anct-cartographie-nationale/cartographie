import { describe, expect, it } from 'vitest';
import { integrationRequestSubject } from './integration-request.schema';

const territoire = { type: 'departement', code: '29', nom: 'Finistère' } as const;

describe('integrationRequestSubject', () => {
  it('should describe a copied link', () => {
    expect(integrationRequestSubject({ sortie: 'lien', territoire })).toBe(
      '[Cartographie] Nouvelle intégration de la cartographie via un copier / coller - Finistère'
    );
  });

  it.each(['iframe', 'web-component'] as const)('should describe a copied %s code', (sortie) => {
    expect(integrationRequestSubject({ sortie, territoire })).toBe(
      '[Cartographie] Nouvelle intégration de la cartographie via une intégration - Finistère'
    );
  });

  it('should describe a downloaded QR code', () => {
    expect(integrationRequestSubject({ sortie: 'qr-code', territoire })).toBe(
      '[Cartographie] Nouvelle intégration de la cartographie via le QR Code - Finistère'
    );
  });
});
