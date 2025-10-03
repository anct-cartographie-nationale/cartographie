import type { ReactNode } from 'react';
import { Marker } from 'react-map-gl/maplibre';

export const ClusterMarker = ({
  latitude,
  longitude,
  title,
  isMuted,
  className,
  children
}: {
  latitude: number;
  longitude: number;
  title?: string;
  isMuted?: boolean;
  className?: string;
  children?: ReactNode;
}) => (
  <Marker latitude={latitude} longitude={longitude} anchor='center' className={className ?? ''}>
    <svg
      className='marker'
      width='72'
      height='72'
      viewBox='0 0 64 64'
      overflow='visible'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <title>{title}</title>
      <g className='marker-shape'>
        <circle opacity='.2' cx='32' cy='32' r='32' className='artwork-major' />
        <g filter='url(#a)'>
          <path
            d='M12 32c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20'
            className={isMuted ? 'artwork-background' : 'artwork-major'}
          />
          <path
            d='M32 12.5c10.77 0 19.5 8.73 19.5 19.5S42.77 51.5 32 51.5 12.5 42.77 12.5 32 21.23 12.5 32 12.5Z'
            className='marker-border-shrink'
          />
        </g>
      </g>
      <text
        className={isMuted ? 'artwork-major' : 'artwork-content'}
        x='50%'
        y='50%'
        dominantBaseline='central'
        textAnchor='middle'
        fontWeight='bold'
        fontSize={12}
      >
        {children}
      </text>
    </svg>
  </Marker>
);
