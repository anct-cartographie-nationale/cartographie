import { describe, expect, it } from 'vitest';
import { fraicheurDuLieu, origineDesInformations } from './fraicheur.presenter';

const MAINTENANT = new Date('2026-11-04T12:00:00Z');

const ilYaJours = (jours: number): string => new Date(MAINTENANT.getTime() - jours * 24 * 60 * 60 * 1000).toISOString();

describe('fraicheurDuLieu', () => {
  it.each([
    ['a-jour', 'À jour', 0],
    ['a-jour', 'À jour', 182],
    ['a-surveiller', 'À surveiller', 183],
    ['a-surveiller', 'À surveiller', 365],
    ['a-verifier', 'À vérifier', 366],
    ['a-verifier', 'À vérifier', 547],
    ['a-actualiser', 'À actualiser', 548],
    ['a-actualiser', 'À actualiser', 2000]
  ])('should be %s (%s) after %i days', (niveau, libelle, jours) => {
    expect(fraicheurDuLieu(ilYaJours(jours), MAINTENANT)).toMatchObject({ niveau, libelle });
  });

  it('should format the date in french, in the Paris time zone', () => {
    expect(fraicheurDuLieu('2026-10-31T23:30:00Z', MAINTENANT).date).toBe('01/11/2026');
  });

  it('should explain each level', () => {
    expect(fraicheurDuLieu(ilYaJours(0), MAINTENANT).explication).toContain('moins de 6 mois');
    expect(fraicheurDuLieu(ilYaJours(200), MAINTENANT).explication).toContain('6 à 12 mois');
    expect(fraicheurDuLieu(ilYaJours(400), MAINTENANT).explication).toContain('12 à 18 mois');
    expect(fraicheurDuLieu(ilYaJours(600), MAINTENANT).explication).toContain('plus de 18 mois');
  });

  it.each([
    ['the 1970 placeholder date', '1970-01-01T00:00:00'],
    ['an invalid date', 'pas une date'],
    ['a missing date', undefined]
  ])('should ask for an update without displaying a date for %s', (_, dateMaj) => {
    const fraicheur = fraicheurDuLieu(dateMaj, MAINTENANT);

    expect(fraicheur).toMatchObject({ niveau: 'a-actualiser', libelle: 'À actualiser' });
    expect(fraicheur.date).toBeUndefined();
    expect(fraicheur.explication).toContain('inconnue');
  });
});

describe('origineDesInformations', () => {
  it('should give the date and the source', () => {
    expect(origineDesInformations('23/11/2024', 'dora')).toBe('Mise à jour le 23/11/2024 · Via dora');
  });

  it('should name the Coop as in the mockup', () => {
    expect(origineDesInformations('23/11/2024', 'Coop numérique')).toBe('Mise à jour le 23/11/2024 · Via la Coop');
  });

  it('should only give the source without date', () => {
    expect(origineDesInformations(undefined, 'Mednum BFC')).toBe('Via Mednum BFC');
  });

  it('should only give the date without source', () => {
    expect(origineDesInformations('23/11/2024', undefined)).toBe('Mise à jour le 23/11/2024');
  });

  it('should be empty without date nor source', () => {
    expect(origineDesInformations(undefined, undefined)).toBe('');
  });
});
