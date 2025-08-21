import type { Metadata } from 'next';
import '@/styles/globals.css';
import type { ReactNode } from 'react';
import { AppLogo, RepubliqueFrancaiseLogo } from '@/features/brand/use-cases/logos';
import { Footer, FooterLegal } from '@/libraries/ui/blocks/footer';
import { footerId } from '@/libraries/ui/blocks/skip-links/skip-links';
import { ThemeChanger } from '@/libraries/ui/blocks/theme-changer';
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
      <ThemeProvider attribute='data-theme' defaultTheme='dark' enableSystem disableTransitionOnChange>
        <div className='h-screen flex flex-col'>
          <div id='skip-links' />
          <div className='navbar bg-navbar px-8 py-4 shadow sticky z-1'>
            <div className='navbar-start'>
              <Link
                href='/'
                title='Retour à l’accueil'
                className='font-bold text-xl text-base-title flex items-center gap-2'
                kind='link-hover'
              >
                <AppLogo />
                Lieux d’inclusion numérique
              </Link>
            </div>
          </div>
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
    </body>
  </html>
);

export default RootLayout;
