import { ThemeChanger } from '@arckit/daisyui/blocks-client';
import type { ReactNode } from 'react';
import { Navbar } from '@/features/brand/abilities/layout';
import { Footer, FooterLegal } from '@/libraries/ui/blocks/footer';
import { contentId, footerId, skipLinksId } from '@/libraries/ui/blocks/skip-links/skip-links';
import SkipLinksPortal from '@/libraries/ui/blocks/skip-links/skip-links-portal';
import { RepubliqueFrancaiseLogo } from '@/libraries/ui/logos';
import { Link } from '@/libraries/ui/primitives/link';

const IntegrationLayout = ({ children }: { children: ReactNode }) => (
  <>
    <div id={skipLinksId} />
    <SkipLinksPortal />
    <Navbar />
    <main id={contentId} className='container mx-auto px-6 pt-8 pb-32 max-w-4xl'>
      {children}
    </main>
    <div className='border-t-2 border-solid border-primary text-neutral' id={footerId}>
      <Footer>
        <div className='flex items-center justify-between gap-12 w-full'>
          <RepubliqueFrancaiseLogo />
          <p className='md:w-128 text-base-content'>
            Une question sur l'intégration de la cartographie ? Consultez la{' '}
            <Link
              target='_blank'
              title="Documentation d'intégration (nouvel onglet)"
              href='https://github.com/anct-cartographie-nationale/cartographie/tree/main/docs'
            >
              documentation technique
            </Link>{' '}
            ou contactez-nous via le bouton Aide.
          </p>
        </div>
      </Footer>
      <FooterLegal accessibility='Non' className='border-t border-solid border-base-400'>
        <ThemeChanger />
      </FooterLegal>
    </div>
  </>
);

export default IntegrationLayout;
