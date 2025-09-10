import { type ReactNode, type SVGProps, useId } from 'react';

export const AppLogo = (props: SVGProps<SVGSVGElement>): ReactNode => {
  const gradientId = useId();

  return (
    <svg width='42' height='40' {...props} viewBox='0 0 42 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <title>Logo de la cartographie nationale des lieux d’inclusion numérique</title>
      <path
        fill='#fff'
        d='M19.408 6.634 8.752 12.786l.046 12.434 8.218 4.785v5.912h4.198v-5.912l8.984-4.68-.045-12.434z'
        transform='translate(-.582 -.138)scale(1.0568)'
      />
      <path
        d='M18.4492 1.6737C19.8304 0.876294 21.533 0.880004 22.9112 1.68248L35.4278 8.97057C36.7907 9.76425 37.6319 11.2205 37.6377 12.7977L37.6905 27.2811C37.6963 28.8759 36.848 30.3519 35.4668 31.1493L23.0244 38.3329C21.6433 39.1302 19.9407 39.1275 18.5625 38.3251L6.04593 31.037C4.68299 30.2434 3.8419 28.7869 3.83597 27.2098L3.78323 12.7255C3.77738 11.1307 4.62573 9.65469 6.00687 8.85729L18.4492 1.6737ZM10.0137 13.7342L10.0596 26.1678L18.2784 30.953L19.6123 35.0887C19.8777 35.9101 21.0404 35.9102 21.3057 35.0887L22.4756 31.4589L31.46 26.2723L31.4151 13.8387L20.669 7.5819L10.0137 13.7342Z'
        fill={`url(#${gradientId})`}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M20.4982 15.1566L16.0246 17.7394L16.0437 22.9398L20.5378 25.5566L25.0115 22.9737L24.9923 17.7734L20.4982 15.1566Z'
        fill='#E1000F'
      />
      <defs>
        <linearGradient id={gradientId} x1='13.7877' y1='38.2524' x2='31.3024' y2='5.32663' gradientUnits='userSpaceOnUse'>
          <stop stopColor='#0C008A' />
          <stop offset='0.51' stopColor='#5F5FE0' />
          <stop offset='1' stopColor='#F4849A' />
        </linearGradient>
      </defs>
    </svg>
  );
};
