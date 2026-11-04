'use client';

import { Button } from '@arckit/daisyui/primitives';
import { RiCrosshair2Line } from 'react-icons/ri';
import { autourHref, autourKey } from '@/libraries/inclusion-numerique-api/filters/autour';
import { useRouter, useSearchParams } from '@/libraries/nextjs/shim';
import { requestResultsFocus } from '@/shared/ui/results-focus.stream';

export const Geolocate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n’est pas supportée par ce navigateur.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;

        requestResultsFocus(autourKey({ lat, lng }));
        router.push(autourHref({ lat, lng, geolocalise: '1' }, new URLSearchParams(searchParams)));
      },
      (error) => {
        console.warn('Erreur de géolocalisation :', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return (
    <Button
      type='button'
      className='border-base-200 p-3 rounded'
      kind='btn-outline'
      color='btn-primary'
      scale='btn-lg'
      onClick={handleGeolocate}
      title='Se géolocaliser'
    >
      <RiCrosshair2Line size={24} />
    </Button>
  );
};
