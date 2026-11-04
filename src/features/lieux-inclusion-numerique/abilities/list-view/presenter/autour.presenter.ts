import { collectivitesFromInsee, type Departement, type Region } from '@/libraries/collectivites';
import type { LieuListItem } from '@/libraries/inclusion-numerique-api';
import { type Autour, isMapCentreAutour } from '@/libraries/inclusion-numerique-api/filters/autour';
import { hrefWithSearchParams } from '@/libraries/nextjs';

type BreadcrumbItem = { label: string; href?: string };

type AutourPlace = Pick<Autour, 'adresse' | 'geolocalise'>;

const placeLabel = ({ adresse, geolocalise }: AutourPlace): string => {
  if (adresse != null) return `de ${adresse}`;
  return geolocalise != null ? 'de votre position' : 'du centre de la carte';
};

export const autourTitle = (totalLieux: number, autour: AutourPlace): string => {
  const place = placeLabel(autour);

  if (totalLieux === 0) return `Aucun lieu trouvé autour ${place}`;
  if (totalLieux === 1) return `Le lieu le plus proche ${place}`;
  return `Les ${totalLieux} lieux les plus proches ${place}`;
};

export const autourStatus = (autour: AutourPlace, nearest?: Pick<LieuListItem, 'nom' | 'adresse'>): string => {
  if (!isMapCentreAutour(autour)) return '';
  return nearest
    ? `Liste triée autour du centre de la carte. Lieu le plus proche : ${nearest.nom}, à ${nearest.adresse.commune}.`
    : 'Aucun lieu trouvé autour du centre de la carte.';
};

export const withNearestCommune = (autour: Autour, lieux: Pick<LieuListItem, 'adresse'>[]): Autour => ({
  ...autour,
  commune: autour.commune ?? lieux[0]?.adresse.code_insee
});

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
