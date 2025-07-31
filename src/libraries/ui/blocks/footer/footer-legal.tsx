import type { ReactNode } from 'react';
import { FooterLinks } from './footer-links';

export const FooterLegal = ({
  accessibility,
  children,
  className
}: {
  accessibility: 'Non' | 'Partiellement' | 'Totalement';
  children?: ReactNode;
  className?: string;
}) => {
  const links = [
    {
      key: 'declaration-d-accessibilite',
      linkProps: { href: '/declaration-d-accessibilite', children: `Accessibilité : ${accessibility} conforme` }
    },
    {
      key: 'conditions-generales-d-utilisation',
      linkProps: { href: '/conditions-generales-d-utilisation', children: 'Conditions générales d’utilisation' }
    },
    { key: 'mentions-legales', linkProps: { href: 'mentions-legales', children: 'Mentions légales' } },
    { key: 'plan-du-site', linkProps: { href: '/plan-du-site', children: 'Plan du site' } },
    { key: 'gestion-des-cookies', linkProps: { href: '/gestion-des-cookies', children: 'Gestion des cookies' } }
  ];

  return (
    <div className={className}>
      <footer className='footer sm:footer-horizontal container mx-auto items-center px-6 py-3'>
        <nav className='flex flex-row flex-wrap gap-4 text-xs items-center' aria-label='Legal links'>
          <FooterLinks links={links} />
          {children}
        </nav>
      </footer>
    </div>
  );
};
