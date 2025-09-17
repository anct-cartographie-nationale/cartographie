import { describe, expect, it } from 'vitest';
import type { LieuListItem } from '@/features/lieux-inclusion-numerique/lieu-list-item';
import type { LieuxRouteResponse } from '../routes';
import { toLieuListItem } from './toLieuListItem';

describe('to lieu list item', () => {
  it('should transform minimal lieu to lieu list item', () => {
    const lieu: LieuxRouteResponse[number] & { region: string; departement: string } = {
      id: '1',
      nom: 'Lieu 1',
      adresse: '123 Rue Principale',
      commune: 'Ville',
      code_postal: '75000',
      code_insee: '75000',
      departement: '75',
      region: 'Île-de-France',
      services: ['Aide aux démarches administratives'].join('|')
    };

    const lieuListItem: LieuListItem = toLieuListItem(new Date('2022-07-22T10:00:00.000Z'))(lieu);

    expect(lieuListItem).toEqual({
      id: '1',
      nom: 'Lieu 1',
      adresse: '123 Rue Principale',
      commune: 'Ville',
      codePostal: '75000',
      departement: '75',
      region: 'Île-de-France',
      isOpen: false,
      isByAppointment: false,
      isFranceServices: false,
      isConum: false
    });
  });

  it('should transform maximal lieu to lieu list item', () => {
    const lieu: LieuxRouteResponse[number] & { region: string; departement: string } = {
      id: '1',
      nom: 'Lieu 1',
      adresse: '123 Rue Principale',
      commune: 'Ville',
      code_postal: '75000',
      code_insee: '75000',
      departement: '75',
      region: 'Île-de-France',
      latitude: 48.8526,
      longitude: 2.3509,
      horaires: 'Mo-Fr 09:00-12:00,13:30-17:30; Tu 10:00-12:30,13:30-17:30',
      dispositif_programmes_nationaux: ['France Services', 'Conseillers numériques'].join('|'),
      modalites_acces: ['Se présenter', 'Téléphoner', 'Contacter par mail'].join('|'),
      services: ['Aide aux démarches administratives'].join('|')
    };

    const lieuListItem: LieuListItem = toLieuListItem(new Date('2025-09-11T15:00:00.000Z'), {
      latitude: 48.8566,
      longitude: 2.3522
    })(lieu);

    expect(lieuListItem).toEqual({
      id: '1',
      nom: 'Lieu 1',
      adresse: '123 Rue Principale',
      commune: 'Ville',
      codePostal: '75000',
      departement: '75',
      region: 'Île-de-France',
      distance: '0.45',
      isOpen: true,
      isByAppointment: true,
      isFranceServices: true,
      isConum: true
    });
  });
});
