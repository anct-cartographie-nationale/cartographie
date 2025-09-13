import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { ButtonLink } from '@/libraries/ui/primitives/button-link';

export const PreviousPageLink = ({ number, disabled }: { number: number; disabled: boolean }) => (
  <ButtonLink disabled={disabled} className='join-item' kind='btn-ghost' href={`?page=${number}`} title='Page précédente'>
    <RiArrowLeftSLine size={18} aria-hidden={true} />
  </ButtonLink>
);

export const NextPageLink = ({ number, disabled }: { number: number; disabled: boolean }) => (
  <ButtonLink disabled={disabled} className='join-item' kind='btn-ghost' href={`?page=${number}`} title='Page suivante'>
    <RiArrowRightSLine size={18} aria-hidden={true} />
  </ButtonLink>
);

export const PageLink = ({ number, isCurrent }: { number: number; isCurrent: boolean }) => (
  <ButtonLink
    className='join-item'
    {...(isCurrent ? { color: 'btn-primary' } : { kind: 'btn-ghost' })}
    href={`?page=${number}`}
    title={`Page ${number}`}
  >
    {number}
  </ButtonLink>
);
