export const contentId = 'contenu';
export const footerId = 'fr-footer';

export const contentSkipLink = { label: 'Contenu', anchor: `#${contentId}` };
export const footerSkipLink = { label: 'Pied de page', anchor: `#${footerId}` };

export const defaultSkipLinks = [contentSkipLink, footerSkipLink];

export const SkipLinks = ({ links }: { links?: { label: string; anchor: string }[] }) => (
  <nav aria-label='Liens de navigation rapide' className='p-4 bg-base-200 skip-links'>
    <ul className='flex gap-4'>
      {links?.map((link) => (
        <li key={link.anchor} className='fr-skiplinks__item'>
          <a href={link.anchor} className='link link-primary'>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);
