import type { ReactNode, SVGProps } from 'react';

export const LieuLogo = (props: SVGProps<SVGSVGElement>): ReactNode => (
  <svg width='48' height='48' {...props} viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <title>Lieu de médiation numérique sans dispositif</title>
    <path
      className='artwork-major'
      fillRule='evenodd'
      clipRule='evenodd'
      d='M33 15a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H15a1 1 0 0 1-1-1v-7.513a1 1 0 0 1 .343-.754L18 20.544V16a1 1 0 0 1 1-1zm-1 2H20v2.127c.234 0 .469.082.657.247l5 4.359a1 1 0 0 1 .343.754V31h6zm-12 4.454-4 3.488V31h3v-4h2v4h3v-6.058zM30 27v2h-2v-2zm0-4v2h-2v-2zm0-4v2h-2v-2zm-4 0v2h-2v-2z'
    />
  </svg>
);
