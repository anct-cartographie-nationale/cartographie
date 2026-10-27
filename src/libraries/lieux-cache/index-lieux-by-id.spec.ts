import { describe, expect, it } from 'vitest';
import type { LieuxRouteResponse } from '@/libraries/inclusion-numerique-api';
import { indexLieuxById } from './index-lieux-by-id';

const lieu = (id: string, idCartographieNationale?: string | null): LieuxRouteResponse[number] =>
  ({ id, nom: `Lieu ${id}`, id_cartographie_nationale: idCartographieNationale }) as LieuxRouteResponse[number];

describe('indexLieuxById', (): void => {
  it("resout un lieu par l'identifiant du registre", (): void => {
    const index = indexLieuxById([lieu('12345', 'France-Services_1350')]);

    expect(index.get('12345')?.nom).toBe('Lieu 12345');
  });

  it('resout aussi un lieu par son identifiant mednum, pour les URL deja partagees', (): void => {
    const index = indexLieuxById([lieu('12345', 'France-Services_1350')]);

    expect(index.get('France-Services_1350')?.nom).toBe('Lieu 12345');
  });

  it("n'ajoute pas de clef pour un lieu sans identifiant mednum", (): void => {
    const index = indexLieuxById([lieu('12345', null), lieu('67890')]);

    expect(index.size).toBe(2);
    expect(index.get('12345')).toBeDefined();
    expect(index.get('67890')).toBeDefined();
  });

  it('ignore un identifiant mednum vide', (): void => {
    const index = indexLieuxById([lieu('12345', '')]);

    expect(index.size).toBe(1);
    expect(index.get('')).toBeUndefined();
  });

  it("fait gagner l'identifiant du registre quand un identifiant mednum lui est identique", (): void => {
    const index = indexLieuxById([lieu('12345', 'France-Services_1350'), lieu('67890', '12345')]);

    expect(index.get('12345')?.id).toBe('12345');
  });

  it("fonctionne avant la bascule, quand la colonne n'est pas encore servie", (): void => {
    const index = indexLieuxById([{ id: 'France-Services_1350', nom: 'Lieu historique' } as LieuxRouteResponse[number]]);

    expect(index.size).toBe(1);
    expect(index.get('France-Services_1350')?.nom).toBe('Lieu historique');
  });
});
