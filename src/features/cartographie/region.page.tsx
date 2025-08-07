import { contentId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { LocationFranceIllustration } from '@/libraries/ui/pictograms/map/location-france.illustration';
import { Link } from '@/libraries/ui/primitives/link';

export const RegionPage = ({
  region,
  departements
}: {
  region: { nom: string; slug: string };
  departements: { nom: string; slug: string; code: string }[];
}) => (
  <>
    <SkipLinksPortal />
    <div className='breadcrumbs text-sm'>
      <ul>
        <li>
          <Link href='/'>France</Link>
        </li>
        <li>{region.nom}</li>
      </ul>
    </div>
    <LocationFranceIllustration className='mt-10 mb-6' />
    <main id={contentId}>
      <h1 className='mb-12 text-3xl font-light'>
        {region.nom}
        <br />
        <span className='font-bold'>1065 lieux d’inclusion numérique</span>
      </h1>
      <h2 className='font-bold uppercase text-xs mb-3'>Filtrer par département</h2>
      <div className='flex flex-wrap gap-1.5'>
        {departements.map((departement) => (
          <Link
            href={`/${region.slug}/${departement.slug}`}
            key={departement.code}
            kind='link-hover'
            className='badge badge-primary badge-soft'
          >
            ({departement.code}) {departement.nom}
          </Link>
        ))}
      </div>
    </main>
  </>
);
