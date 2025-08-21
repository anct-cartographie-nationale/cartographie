'use client';

import type { ReactNode } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import { CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID } from '@/features/cartographie/cartographie-ids';
import type { Departement } from '@/features/collectivites-territoriales/departement';
import type { Region } from '@/features/collectivites-territoriales/region';
import { Breadcrumbs } from '@/libraries/ui/blocks/breadcrumbs';
import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { LieuxList } from './lieux-list';

type Lieu = {
  id: string;
  nom: string;
  commune: string;
  distance?: number;
  isOpen?: boolean;
  isByAppointment?: boolean;
  isFranceServices?: boolean;
  isConum?: boolean;
  region: Region;
  departement: Departement;
};

const lieux: Omit<Lieu, 'region' | 'departement'>[] = [
  {
    id: 'a7dff9b0-3c1f-4d2a-8c5e-6f7b8c9d0e1f',
    nom: 'France services marianne',
    commune: 'Eloie',
    distance: 5,
    isFranceServices: true,
    isOpen: true
  },
  {
    id: 'b8dff9b0-3c1f-4d2a-8c5e-6f7b8c9d0e2f',
    nom: 'Agence postale intercommunale arcey',
    commune: 'Chaux',
    distance: 7,
    isConum: true,
    isByAppointment: true
  },
  {
    id: 'c9dff9b0-3c1f-4d2a-8c5e-6f7b8c9d0e3f',
    nom: 'La ressourcerie 90',
    commune: 'Valdoie',
    distance: 8,
    isConum: true,
    isOpen: true,
    isByAppointment: true
  },
  {
    id: 'd0dff9b0-3c1f-4d2a-8c5e-6f7b8c9d0e4f',
    nom: 'Centre communal d’action sociale',
    commune: 'Cravanche',
    distance: 18,
    isByAppointment: true
  },
  {
    id: 'e1dff9b0-3c1f-4d2a-8c5e-6f7b8c9d0e5f',
    nom: 'Antenne locale héricourt',
    commune: 'Belfort',
    distance: 19,
    isConum: true,
    isByAppointment: true
  }
];

const toLieuxWithLocality =
  (region: Region, departement: Departement) =>
  (lieu: Omit<Lieu, 'region' | 'departement'>): Lieu => ({
    ...lieu,
    region,
    departement
  });

export const LieuxPage = ({ region, departement }: { region: Region; departement: Departement }): ReactNode => {
  const map = useMap()[CARTOGRAPHIE_LIEUX_INCLUSION_NUMERIQUE_ID];

  map?.flyTo({
    center: [departement.localisation.longitude, departement.localisation.latitude],
    zoom: departement.zoom,
    duration: 400
  });

  return (
    <>
      <SkipLinksPortal />
      <Breadcrumbs
        items={[{ label: 'France', href: '/' }, { label: region.nom, href: `/${region.slug}` }, { label: departement.nom }]}
      />
      <main id={contentId}>
        <h1 className='font-bold uppercase text-xs text-base-title my-6'>
          <span className='sr-only'>{departement.nom}</span> 25 lieux trouvés
        </h1>
        <LieuxList lieux={lieux.map(toLieuxWithLocality(region, departement))} />
      </main>
    </>
  );
};
