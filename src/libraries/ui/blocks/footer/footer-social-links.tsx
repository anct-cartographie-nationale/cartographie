import { type FooterLink, FooterLinks } from './footer-links';

export const FooterSocialLinks = ({ links }: { links: FooterLink[] }) =>
  links.length > 0 && (
    <nav className='m-auto grid-flow-col gap-4 md:m-0 md:place-self-center md:justify-self-end' aria-label='Social Media Links'>
      <FooterLinks
        links={links.map((link) => ({
          ...{
            key: link.key,
            linkProps: {
              ...link.linkProps,
              iconOnly: true,
              target: '_blank'
            }
          }
        }))}
      />
    </nav>
  );
