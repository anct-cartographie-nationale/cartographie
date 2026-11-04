import { collectivitesFromInsee, type Departement, type Region } from '@/libraries/collectivites';
import type { Autour } from '@/libraries/inclusion-numerique-api/filters/autour';
import { hrefWithSearchParams } from '@/libraries/nextjs';

type BreadcrumbItem = { label: string; href?: string };

const placeLabel = (adresse?: string): string => adresse ?? 'la position recherchée';

export const autourTitle = (totalLieux: number, adresse?: string): string => {
  const place = placeLabel(adresse);

  if (totalLieux === 0) return `Aucun lieu trouvé autour de ${place}`;
  if (totalLieux === 1) return `Le lieu le plus proche de ${place}`;
  return `Les ${totalLieux} lieux les plus proches de ${place}`;
};

const territoireItems = (collectivites: { region: Region; departement: Departement } | undefined, filters: URLSearchParams) =>
  collectivites
    ? [
        {
          label: collectivites.region.nom,
          href: hrefWithSearchParams(`/${collectivites.region.slug}`)(new URLSearchParams(filters))
        },
        {
          label: collectivites.departement.nom,
          href: hrefWithSearchParams(`/${collectivites.region.slug}/${collectivites.departement.slug}`)(
            new URLSearchParams(filters)
          )
        }
      ]
    : [];

export const autourBreadcrumbs = ({ commune }: Autour, filters: URLSearchParams): BreadcrumbItem[] => [
  { label: 'France', href: hrefWithSearchParams('/')(new URLSearchParams(filters)) },
  ...territoireItems(commune ? collectivitesFromInsee(commune) : undefined, filters),
  { label: 'À proximité' }
];

export const autourExit = ({ commune }: Autour, filters: URLSearchParams): BreadcrumbItem | undefined => {
  const collectivites = commune ? collectivitesFromInsee(commune) : undefined;

  return collectivites
    ? {
        label: `Voir tous les lieux du département : ${collectivites.departement.nom}`,
        href: hrefWithSearchParams(`/${collectivites.region.slug}/${collectivites.departement.slug}`)(
          new URLSearchParams(filters)
        )
      }
    : undefined;
};
