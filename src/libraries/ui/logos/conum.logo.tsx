import type { ReactNode, SVGProps } from 'react';

export const ConumLogo = (props: SVGProps<SVGSVGElement>): ReactNode => (
  <svg width='48' height='48' {...props} viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <title>Lieu de médiation numérique du dispositif Conseiller Numérique</title>
    <path d='M0 2a2 2 0 0 1 2-2h44a2 2 0 0 1 2 2v44a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z' fill='#fff' />
    <path d='m24 7.2-9.6 5.529v11.085l9.088 15.667h1.024L33.6 23.814V12.729z' fill='#E1000F' />
    <path d='M26.739 16.67h3.635v-2.073L24 10.91l-6.4 3.687v7.347l6.4 3.712 6.374-3.712v-2.1h-3.635z' fill='#fff' />
    <path d='M26.738 19.848v-3.175L24 15.086l-2.765 1.587v3.175L24 21.435z' fill='#000091' />
  </svg>
);
