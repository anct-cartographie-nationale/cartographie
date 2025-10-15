'use client';

import { RiCrosshair2Line } from 'react-icons/ri';
import { useSubscribe } from '@/libraries/reactivity/Subscribe';
import { Button } from '@/libraries/ui/primitives/button';
import { map$ } from './map/streams/map.stream';

export const Geolocate = () => {
  const [map] = useSubscribe(map$);

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n’est pas supportée par ce navigateur.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        map?.flyTo({
          center: [longitude, latitude],
          zoom: 13,
          duration: 400
        });
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
