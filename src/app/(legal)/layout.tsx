import type { ReactNode } from 'react';
import { Navbar } from '@/features/brand/abilities/layout';
import { Footer, FooterLegal } from '@/libraries/ui/blocks/footer';
import { SkipLinksPortal } from '@/libraries/ui/blocks/skip-links';
import { contentId, footerId, skipLinksId } from '@/libraries/ui/blocks/skip-links/skip-links';
import { ThemeChanger } from '@/libraries/ui/blocks/theme-changer';
import { RepubliqueFrancaiseLogo } from '@/libraries/ui/logos';
import { Link } from '@/libraries/ui/primitives/link';

const LegalLayout = ({ children }: { children: ReactNode }) => (
  <>
    <div id={skipLinksId} />
    <SkipLinksPortal />
    <Navbar />
    <main id={contentId} className='container mx-auto px-6 pt-8 pb-32 max-w-4xl'>
      <article>{children}</article>
    </main>
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

export default LegalLayout;
