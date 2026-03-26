import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Navbar } from '@/features/brand/abilities/layout';
import { Geolocate, SearchAddress } from '@/features/cartographie';
import {
  BesoinsFilters,
  DisponibiliteFilters,
  DispositifsFilters,
  PublicCibleFilters,
  TerritoiresPrioritairesFilters
} from '@/features/lieux-inclusion-numerique';
import { Footer, FooterLegal } from '@/libraries/ui/blocks/footer';
import { footerId, skipLinksId } from '@/libraries/ui/blocks/skip-links/skip-links';
import { ThemeChanger } from '@/libraries/ui/blocks/theme-changer';
import { RepubliqueFrancaiseLogo } from '@/libraries/ui/logos';
import { Link } from '@/libraries/ui/primitives/link';
import { metadata as appMetadata } from './metadata';

export const metadata: Metadata = appMetadata;

const MainLayout = ({ children }: { children: ReactNode }) => (
  <>
    <div className='h-dvh flex flex-col'>
      <div id={skipLinksId} />
      <Navbar
        searchSlot={
          <div className='flex gap-2'>
            <SearchAddress className='sm:w-100 w-full pr-0' />
            <Geolocate />
          </div>
        }
        filtersSlot={
          <>
            <BesoinsFilters />
            <PublicCibleFilters />
            <DisponibiliteFilters />
            <DispositifsFilters />
            <TerritoiresPrioritairesFilters />
          </>
        }
      />
      {children}
    </div>
    <div className='border-t-2 border-solid border-primary text-neutral' id={footerId}>
      <Footer>
        <div className='flex items-center justify-between gap-12 w-full'>
          <RepubliqueFrancaiseLogo />
          <p className='md:w-128 text-base-content'>
            Vous souhaitez apparaître sur la cartographie ? il vous suffit de renseigner vos données sur{' '}
            <Link
              target='_blank'
              title='La Coop de la médiation numérique (nouvel onglet)'
              rel='noopener noreferrer'
              href='https://coop-numerique.anct.gouv.fr'
            >
              La Coop de la médiation numérique
            </Link>
            .
          </p>
        </div>
      </Footer>
      <FooterLegal accessibility='Non' className='border-t border-solid border-base-400'>
        <ThemeChanger />
      </FooterLegal>
    </div>
  </>
);

export default MainLayout;
