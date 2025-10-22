import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';

const pageHref = (href: string) => (number: number) => {
  const [baseHref, queryString] = href.split('?');

  const searchParams = new URLSearchParams(queryString);
  searchParams.delete('page');
  searchParams.append('page', number.toString());

  return `${baseHref}?${searchParams.toString()}`;
};

export const PreviousPageLink = ({ number, disabled, href }: { number: number; disabled: boolean; href: string }) => (
  <ButtonLink disabled={disabled} className='join-item' kind='btn-ghost' href={pageHref(href)(number)} title='Page précédente'>
    <RiArrowLeftSLine size={18} aria-hidden={true} />
  </ButtonLink>
);

export const NextPageLink = ({ number, disabled, href }: { number: number; disabled: boolean; href: string }) => (
  <ButtonLink disabled={disabled} className='join-item' kind='btn-ghost' href={pageHref(href)(number)} title='Page suivante'>
    <RiArrowRightSLine size={18} aria-hidden={true} />
  </ButtonLink>
);

export const PageLink = ({ number, isCurrent, href }: { number: number; isCurrent: boolean; href: string }) => (
  <ButtonLink
    className='join-item'
    {...(isCurrent ? { color: 'btn-primary' } : { kind: 'btn-ghost' })}
    href={pageHref(href)(number)}
    title={`Page ${number}`}
  >
    {number}
  </ButtonLink>
);
