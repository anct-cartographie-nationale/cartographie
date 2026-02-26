import { describe, expect, it } from 'vitest';
import { type BreadcrumbItem, filterBreadcrumbItems } from './filter-breadcrumb-items';

describe('filterBreadcrumbItems', () => {
  const fullBreadcrumbs: BreadcrumbItem[] = [
    { label: 'France', href: '/' },
    { label: 'Auvergne-Rhône-Alpes', href: '/auvergne-rhone-alpes' },
    { label: 'Rhône', href: '/auvergne-rhone-alpes/rhone' },
    { label: 'Lyon 1er' }
  ];

  describe('sans filtre', () => {
    it("devrait retourner tous les items quand aucun filtre n'est configuré", () => {
      const result = filterBreadcrumbItems(fullBreadcrumbs, {});
      expect(result).toEqual(fullBreadcrumbs);
    });

    it("devrait retourner tous les items quand le filtre n'a pas de codes", () => {
      const result = filterBreadcrumbItems(fullBreadcrumbs, { type: 'departements', codes: [] });
      expect(result).toEqual(fullBreadcrumbs);
    });

    it("devrait retourner tous les items quand le filtre n'a pas de type", () => {
      const result = filterBreadcrumbItems(fullBreadcrumbs, { codes: ['69'] });
      expect(result).toEqual(fullBreadcrumbs);
    });
  });

  describe('filtre regions', () => {
    it('devrait afficher France si plusieurs régions', () => {
      const result = filterBreadcrumbItems(fullBreadcrumbs, { type: 'regions', codes: ['84', '93'] });
      expect(result).toEqual(fullBreadcrumbs);
    });

    it('devrait masquer France si une seule région', () => {
      const result = filterBreadcrumbItems(fullBreadcrumbs, { type: 'regions', codes: ['84'] });
      expect(result).toEqual([
        { label: 'Auvergne-Rhône-Alpes', href: '/auvergne-rhone-alpes' },
        { label: 'Rhône', href: '/auvergne-rhone-alpes/rhone' },
        { label: 'Lyon 1er' }
      ]);
    });
  });

  describe('filtre departements', () => {
    it('devrait masquer France et afficher Région si plusieurs départements', () => {
      const result = filterBreadcrumbItems(fullBreadcrumbs, { type: 'departements', codes: ['69', '38', '01'] });
      expect(result).toEqual([
        { label: 'Auvergne-Rhône-Alpes', href: '/auvergne-rhone-alpes' },
        { label: 'Rhône', href: '/auvergne-rhone-alpes/rhone' },
        { label: 'Lyon 1er' }
      ]);
    });

    it('devrait masquer France et Région si un seul département', () => {
      const result = filterBreadcrumbItems(fullBreadcrumbs, { type: 'departements', codes: ['69'] });
      expect(result).toEqual([{ label: 'Rhône', href: '/auvergne-rhone-alpes/rhone' }, { label: 'Lyon 1er' }]);
    });
  });

  describe('filtre communes', () => {
    it('devrait masquer France et Région, afficher Département si plusieurs communes', () => {
      const result = filterBreadcrumbItems(fullBreadcrumbs, { type: 'communes', codes: ['69123', '69385'] });
      expect(result).toEqual([{ label: 'Rhône', href: '/auvergne-rhone-alpes/rhone' }, { label: 'Lyon 1er' }]);
    });

    it('devrait masquer France, Région et Département si une seule commune', () => {
      const result = filterBreadcrumbItems(fullBreadcrumbs, { type: 'communes', codes: ['69123'] });
      expect(result).toEqual([{ label: 'Lyon 1er' }]);
    });
  });

  describe('breadcrumbs partiels', () => {
    it('devrait fonctionner avec seulement France et Région', () => {
      const regionBreadcrumbs: BreadcrumbItem[] = [{ label: 'France', href: '/' }, { label: 'Auvergne-Rhône-Alpes' }];

      const result = filterBreadcrumbItems(regionBreadcrumbs, { type: 'regions', codes: ['84'] });
      expect(result).toEqual([{ label: 'Auvergne-Rhône-Alpes' }]);
    });

    it('devrait fonctionner avec France, Région et Département', () => {
      const deptBreadcrumbs: BreadcrumbItem[] = [
        { label: 'France', href: '/' },
        { label: 'Auvergne-Rhône-Alpes', href: '/auvergne-rhone-alpes' },
        { label: 'Rhône' }
      ];

      const result = filterBreadcrumbItems(deptBreadcrumbs, { type: 'departements', codes: ['69'] });
      expect(result).toEqual([{ label: 'Rhône' }]);
    });
  });
});
