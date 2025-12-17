import type { Metadata } from 'next';
import '@/styles/globals.css';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { Navbar } from '@/features/brand/use-cases/layout';
import { RepubliqueFrancaiseLogo } from '@/features/brand/use-cases/logos';
import { Footer, FooterLegal } from '@/libraries/ui/blocks/footer';
import { footerId, skipLinksId } from '@/libraries/ui/blocks/skip-links/skip-links';
import { ThemeChanger } from '@/libraries/ui/blocks/theme-changer';
import { Toaster } from '@/libraries/ui/blocks/toaster';
import { Link } from '@/libraries/ui/primitives/link';
import { ThemeProvider } from '@/libraries/ui/theme/providers';
import { metadata as appMetadata } from './metadata';

export const metadata: Metadata = appMetadata;

const RootLayout = ({
  children
}: Readonly<{
  children: ReactNode;
}>) => (
  <html lang='fr' data-theme='light' suppressHydrationWarning>
    <body>
      <NuqsAdapter>
        <ThemeProvider attribute='data-theme' defaultTheme='dark' enableSystem disableTransitionOnChange>
          <Toaster directionY='toast-top' directionX='toast-center' />
          <div className='h-dvh flex flex-col'>
            <div id={skipLinksId} />
            <Navbar />
            {children}
          </div>
          <div className='border-t-2 border-solid border-primary text-muted' id={footerId}>
            <Footer>
              <div className='flex items-center justify-between gap-12 w-full'>
                <RepubliqueFrancaiseLogo />
                <p className='md:w-128 text-base-content'>
                  Vous souhaitez apparaître sur la cartographie ? il vous suffit de renseigner vos données sur{' '}
                  <Link
                    target='_blank'
                    title='La Coop de la médiation numérique (nouvel onglet)'
                    rel='noopener noreferrer'
                    href='https://lesbases.anct.gouv.fr/ressources/comment-apparaitre-ou-modifier-vos-donnees-sur-la-cartographie-nationale'
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
        </ThemeProvider>
      </NuqsAdapter>
    </body>
  </html>
);

export default RootLayout;
