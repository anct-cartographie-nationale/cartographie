import { useId } from 'react';
import { Marker } from 'react-map-gl/maplibre';

export const LieuMarker = ({
  latitude,
  longitude,
  title,
  className
}: {
  latitude: number;
  longitude: number;
  title?: string;
  className?: string;
}) => {
  const filterId = useId();

  return (
    <Marker latitude={latitude} longitude={longitude} anchor='center' className={className ?? ''}>
      <svg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <title>{title}</title>
        <g filter={`url(#${filterId})`}>
          <path
            d='M6.258 16c0-6.627 5.372-12 12-12 6.627 0 12 5.373 12 12s-5.373 12-12 12c-6.628 0-12-5.373-12-12'
            className='artwork-major'
          />
          <path
            d='M18.258 4.5c6.351 0 11.5 5.149 11.5 11.5s-5.149 11.5-11.5 11.5-11.5-5.149-11.5-11.5 5.148-11.5 11.5-11.5Z'
            stroke='#fff'
          />
        </g>
        <defs>
          <filter id={filterId} x='.258' y='0' width='36' height='36' filterUnits='userSpaceOnUse'>
            <feOffset dy='2' />
            <feGaussianBlur stdDeviation='2' />
            <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0705882 0 0 0 0.16 0' />
            <feBlend in='SourceGraphic' />
          </filter>
        </defs>
      </svg>
    </Marker>
  );
};
