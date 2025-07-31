import type { ReactNode } from 'react';
import { type FooterLink, FooterLinks } from './footer-links';

export type Category = {
  name: string;
  links: FooterLink[];
};

export const Footer = ({
  categories = [],
  children,
  className
}: {
  categories?: Category[];
  children?: ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <footer className='footer sm:footer-horizontal container mx-auto px-6 py-8 xl:flex xl:gap-12'>
      {children}
      {categories.map(({ name, links }, index) => (
        <nav key={name} aria-labelledby={`footer-title-${index}`}>
          <h2 id={`footer-title-${index}`} className='footer-title text-base-content opacity-100'>
            {name}
          </h2>
          <FooterLinks links={links} />
        </nav>
      ))}
    </footer>
  </div>
);
