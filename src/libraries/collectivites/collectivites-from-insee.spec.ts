import { describe, expect, it } from 'vitest';
import { collectivitesFromInsee } from './collectivites-from-insee';

describe('collectivitesFromInsee', () => {
  it('finds the department and the region of a commune', () => {
    const collectivites = collectivitesFromInsee('29103');

    expect(collectivites?.departement.nom).toBe('Finistère');
    expect(collectivites?.region.nom).toBe('Bretagne');
  });

  it('finds the collectivites of an overseas commune', () => {
    expect(collectivitesFromInsee('97105')?.departement.nom).toBe('Guadeloupe');
  });

  it('finds the collectivites of a Corsican commune', () => {
    expect(collectivitesFromInsee('2A004')?.departement.nom).toBe('Corse-du-Sud');
  });

  it('returns nothing for an unknown code', () => {
    expect(collectivitesFromInsee('00000')).toBeUndefined();
  });
});
